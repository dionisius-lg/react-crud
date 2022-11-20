import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetchApi from "./../helpers/fetchApi";
import { PaginationInfo } from "./../helpers/pagination";
import { isEmptyValue } from "./../helpers/general";
import _ from "lodash";

// create slice
const name = 'product_categories'
const initialState = createInitialState()
const extraActions = createExtraActions()
const extraReducers = createExtraReducers()
const slice = createSlice({ name, initialState, extraReducers })

// exports
export const productCategoriesActions = { ...slice.actions, ...extraActions }
export const productCategoriesReducer = slice.reducer

// implementation
function createInitialState() {
    return {
        all: { loading: false, success: null, result: null },
        detail: { loading: false, success: null, result: null },
        create: { loading: false, success: null, result: null },
        update: { loading: false, success: null, result: null },
        remove: { loading: false, success: null, result: null }
    }
}

function createExtraActions() {
    return {
        getAll: getAll(),
        getDetail: getDetail(),
        create: create(),
        update: update(),
        remove: remove()
    }

    function getAll() {
        return createAsyncThunk(
            `${name}/getAll`,
            async ({ param }) => {
                let query = { limit: 20 }

                if (!isEmptyValue(param) && _.isObject(param)) {
                    Object.keys(param).forEach((key) => {
                        if (!isEmptyValue(param[key])) {
                            query[key] = param[key]
                        }
                    })
                }

                query = !isEmptyValue(query) ? new URLSearchParams(query).toString() : ''

                return await fetchApi.get(`/${name}?${query}`)
            }
        )
    }

    function getDetail() {
        return createAsyncThunk(
            `${name}/getDetail`,
            async ({ id }) => {
                return await fetchApi.get(`/${name}/${id}`)
            }
        )
    }

    function create() {
        return createAsyncThunk(
            `${name}/create`,
            async ({ data }) => {
                let body = {}

                if (!isEmptyValue(data) && _.isObject(data)) {
                    Object.keys(data).forEach((key) => {
                        if (!isEmptyValue(data[key])) {
                            body[key] = data[key]
                        }
                    })
                }

                return await fetchApi.post(`/${name}`, body)
            }
        )
    }

    function update() {
        return createAsyncThunk(
            `${name}/update`,
            async ({ id, data }) => {
                let body = {}

                if (!isEmptyValue(data) && _.isObject(data)) {
                    Object.keys(data).forEach((key) => {
                        if (!isEmptyValue(data[key])) {
                            body[key] = data[key]
                        }
                    })
                }

                return await fetchApi.put(`/${name}/${id}`, body)
            }
        )
    }

    function remove() {
        return createAsyncThunk(
            `${name}/remove`,
            async ({ id }) => {
                return await fetchApi.delete(`/${name}/${id}`)
            }
        )
    }
}

function createExtraReducers() {
    return {
        ...getAll(),
        ...getDetail(),
        ...create(),
        ...update(),
        ...remove()
    };

    function getAll() {
        const { pending, fulfilled, rejected } = extraActions.getAll

        return {
            [pending]: (state) => {
                state.all = {
                    loading: true,
                    success: null
                }
            },
            [fulfilled]: (state, action) => {
                const { success, total_data, data, paging } = action.payload

                let result = {
                    loading: false,
                    success: success,
                    total: total_data,
                    data: data,
                    limit: action.meta.arg?.limit || 20
                }

                if (paging) {
                    const pagingInfo = PaginationInfo({
                        total: total_data,
                        limit: result.limit,
                        current: paging.current
                    })

                    result.paging = {
                        ...paging,
                        index: pagingInfo.index
                    }
                }

                state.all = result
            },
            [rejected]: (state, action) => {
                const { success, message } = action.error

                state.all = {
                    loading: false,
                    success: success,
                    message: message
                }
            }
        }
    }

    function getDetail() {
        const { pending, fulfilled, rejected } = extraActions.getDetail

        return {
            [pending]: (state) => {
                state.detail = {
                    loading: true,
                    success: null
                }
            },
            [fulfilled]: (state, action) => {
                const { success, total_data, data } = action.payload

                state.detail = {
                    loading: false,
                    success: success,
                    total: total_data,
                    data: data
                }
            },
            [rejected]: (state, action) => {
                const { success, message } = action.error

                state.detail = {
                    loading: false,
                    success: success,
                    message: message
                }
            }
        }
    }

    function create() {
        const { pending, fulfilled, rejected } = extraActions.create

        return {
            [pending]: (state) => {
                state.create = {
                    loading: true,
                    success: null
                }
            },
            [fulfilled]: (state, action) => {
                const { success, total_data, data } = action.payload

                state.create = {
                    loading: false,
                    success: success,
                    total: total_data,
                    data: data
                }
            },
            [rejected]: (state, action) => {
                const { success, message } = action.error

                state.create = {
                    loading: false,
                    success: success,
                    message: message
                }
            }
        }
    }

    function update() {
        const { pending, fulfilled, rejected } = extraActions.update

        return {
            [pending]: (state) => {
                state.update = {
                    loading: true,
                    success: null
                }
            },
            [fulfilled]: (state, action) => {
                const { success, total_data, data } = action.payload

                state.update = {
                    loading: false,
                    success: success,
                    total: total_data,
                    data: data
                }
            },
            [rejected]: (state, action) => {
                const { success, message } = action.error

                state.update = {
                    loading: false,
                    success: success,
                    message: message
                }
            }
        }
    }

    function remove() {
        const { pending, fulfilled, rejected } = extraActions.remove

        return {
            [pending]: (state) => {
                state.remove = {
                    loading: true,
                    success: null
                }
            },
            [fulfilled]: (state, action) => {
                const { success, total_data, data } = action.payload

                state.remove = {
                    loading: false,
                    success: success,
                    total: total_data,
                    data: data
                }
            },
            [rejected]: (state, action) => {
                const { success, message } = action.error

                state.remove = {
                    loading: false,
                    success: success,
                    message: message
                }
            }
        }
    }
}
