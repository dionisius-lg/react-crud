import axios from "axios";

const api = async (method, endpoint, data, token = false) => {
    const type = method.toString().toLowerCase() || 'get'
    // const token = 

    axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000'
    axios.defaults.headers['Content-Type'] = 'application/json'

    if (token) {
        axios.defaults.headers.common = {
            'Authorization': `Bearer ${token}`
        }
    }

    let result = {}

    switch (type) {
        case 'post':
            result = await axios.post(endpoint, data).catch(handleError)
            break
        case 'put':
            result = await axios.put(endpoint, data).catch(handleError)
            break
        case 'delete':
            result = await axios.delete(endpoint).catch(handleError)
            break
        default:
            result = await axios.get(endpoint).catch(handleError)
            break
    }

    return result.data
}

const handleError = (error) => {
    if (error.response) {
        return error.response
    }

    let data = {
        request_time: new Date().getTime(),
        response_code: 503,
        success: false,
        message: 'Service Unavailable'
    }

    return { data }
}

export default api