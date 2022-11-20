import { store, authActions } from "../store";
import api from "../api";

const fetchApi = {
    get: request('GET'),
    post: request('POST'),
    put: request('PUT'),
    delete: request('DELETE')
}

export default fetchApi

function request(method) {
    return async (endpoint, body) => {
        const token = authToken(endpoint)
        const response = await api(method, endpoint, body, token);

        if (!token) {
            return handleResponseUser(response);
        }

        return handleResponse(response);
    }
}

// helper functions

function authToken(endpoint) {
    if (endpoint !== '/token') {
        const token = getToken()
        return token
    }

    return false
}

function getToken() {
    return store.getState().auth?.user.token;
}

function handleResponse(response) {
    if ([401, 403].includes(response.response_code) && authToken()) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        const logout = () => store.dispatch(authActions.logout());
        logout();
    }

    if (![200, 201].includes(response.response_code)) {
        return Promise.reject(response);
    }

    return Promise.resolve(response)
}

async function handleResponseUser(response) {
    if ([401, 403].includes(response.response_code) && authToken()) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        const logout = () => store.dispatch(authActions.logout());
        logout();
    }

    if (![200, 201].includes(response.response_code)) {
        return Promise.reject(response);
    }

    const { data } = response
    let responseUser = await api('GET', `/users/${data.id}`, [], data.token)

    if ([401, 403].includes(responseUser.response_code)) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        const logout = () => store.dispatch(authActions.logout());
        logout();
    }

    if (![200, 201].includes(responseUser.response_code)) {
        return Promise.reject(responseUser);
    }
    
    responseUser.data = {
        ...data,
        ...responseUser.data
    }

    return Promise.resolve(responseUser)
}