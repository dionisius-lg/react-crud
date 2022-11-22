import { store, authActions } from "../store";
import axios from "axios";

const request = (method) => {
    return async (endpoint, body) => {
        return await requestApi({ method, endpoint, body })
    }
}

const requestApi = async ({ method, endpoint, body, attempt = 0 }) => {
    axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000'
    axios.defaults.headers['Content-Type'] = 'application/json'

    if (endpoint !== '/token') {
        axios.defaults.headers.common = {
            'Authorization': `Bearer ${authUser().token || ''}`
        }
    }

    let result = {}

    switch (method) {
        case 'POST':
            result = await axios.post(endpoint, body).catch(handleError)
            break
        case 'PUT':
            result = await axios.put(endpoint, body).catch(handleError)
            break
        case 'DELETE':
            result = await axios.delete(endpoint).catch(handleError)
            break
        default:
            result = await axios.get(endpoint).catch(handleError)
            break
    }

    const { data } = result

    if (data.response_code === 401 && attempt < 3) {
        attempt++
        return await refreshToken({ method, endpoint, attempt })
    }

    return handleResponse(data)
}

const authUser = () => {
    return store.getState().auth?.user
}

const refreshToken = async ({ method, endpoint, attempt }) => {
    axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000'
    axios.defaults.headers['Content-Type'] = 'application/json'
    axios.defaults.headers.common = {
        'Authorization': `Bearer ${authUser().refresh_token || ''}`
    }

    const body = {
        token: authUser().token || ''
    }

    const result = await axios.post('/token/refresh', body).catch(handleError)
    const { data } = result

    if (data.response_code === 200) {
        const relogin = () => {
            store.dispatch(authActions.relogin(data))
            store.dispatch(authActions.user({ id: data.data.id }))
        }

        relogin()
    }

    return await requestApi({ method, endpoint, attempt })
}

const handleError = (error) => {
    if (error?.response) {
        return error.response
    }

    const data = {
        request_time: new Date().getTime(),
        response_code: 503,
        success: false,
        message: 'Service Unavailable'
    }

    return { data }
}

const handleResponse = (response) => {
    if ([401, 403].includes(response.response_code) && authUser()) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        const logout = () => store.dispatch(authActions.logout())
        logout()
    }

    if (![200, 201].includes(response.response_code)) {
        return Promise.reject(response)
    }

    return Promise.resolve(response)
}

const fetchApi = {
    get: request('GET'),
    post: request('POST'),
    put: request('PUT'),
    delete: request('DELETE')
}

export default fetchApi
