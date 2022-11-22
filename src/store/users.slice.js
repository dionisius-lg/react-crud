import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetchApi from "./../helpers/fetchApi";
import { isEmptyValue } from "./../helpers/general";
import { PaginationInfo } from "./../helpers/pagination";
import _ from "lodash";

// create slice
const name = 'users'
const initialState = createInitialState()
const extraActions = createExtraActions()
const extraReducers = createExtraReducers()
const reducers = createReducers()
const slice = createSlice({ name, initialState, reducers, extraReducers })

// exports
export const usersActions = { ...slice.actions, ...extraActions }
export const usersReducer = slice.reducer

// implementation
function createInitialState() {
    return {
        all: { loading: false },
        detail: { loading: false },
        create: { loading: false },
        update: { loading: false },
        remove: { loading: false },
    }
}

function createReducers() {
    const clearState = (state = initialState) => {
        state.create = initialState.create
        state.update = initialState.update
        state.remove = initialState.remove
    }

    return {
        clearState
    }
}

function createExtraActions() {
    const getAll = () => {
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

    const getDetail = () => {
        return createAsyncThunk(
            `${name}/getDetail`,
            async ({ id }) => {
                return await fetchApi.get(`/${name}/${id}`)
            }
        )
    }

    const create = () => {
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

    const update = () => {
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

    const remove = () => {
        return createAsyncThunk(
            `${name}/remove`,
            async ({ id }) => {
                return await fetchApi.delete(`/${name}/${id}`)
            }
        )
    }

    return {
        getAll: getAll(),
        getDetail: getDetail(),
        create: create(),
        update: update(),
        remove: remove()
    }
}

function createExtraReducers() {
    const getAll = () => {
        const { pending, fulfilled, rejected } = extraActions.getAll

        return {
            [pending]: (state) => {
                state.all.loading = true
            },
            [fulfilled]: (state, action) => {
                const { total_data, data, paging } = action.payload
                const limit = action.meta.arg?.param?.limit || 20

                let result = {
                    total: total_data,
                    data: data,
                    limit: limit
                }

                if (paging) {
                    const pagingInfo = PaginationInfo({
                        total: total_data,
                        limit: limit,
                        current: paging.current
                    })

                    result.paging = {
                        ...paging,
                        index: pagingInfo.index
                    }
                }

                state.all.result = result
                state.all.loading = false
            },
            [rejected]: (state, action) => {
                const { message } = action.error

                state.all.error = message
                state.all.loading = false
            }
        }
    }

    const getDetail = () => {
        const { pending, fulfilled, rejected } = extraActions.getDetail

        return {
            [pending]: (state) => {
                state.detail.loading = true
            },
            [fulfilled]: (state, action) => {
                const { total_data, data } = action.payload

                state.detail.result = {
                    total: total_data,
                    data: data
                }

                state.detail.loading = false
            },
            [rejected]: (state, action) => {
                const { message } = action.error

                state.detail.error = message
                state.detail.loading = false
            }
        }
    }

    const create = () => {
        const { pending, fulfilled, rejected } = extraActions.create

        return {
            [pending]: (state) => {
                state.create.loading = true
            },
            [fulfilled]: (state, action) => {
                const { total_data, data } = action.payload

                state.create.result = {
                    total: total_data,
                    data: data
                }

                state.create.loading = false
            },
            [rejected]: (state, action) => {
                const { message } = action.error

                state.create.error = message
                state.create.loading = false
            }
        }
    }

    const update = () => {
        const { pending, fulfilled, rejected } = extraActions.update

        return {
            [pending]: (state) => {
                state.update.loading = true
            },
            [fulfilled]: (state, action) => {
                const { total_data, data } = action.payload

                state.update.result = {
                    total: total_data,
                    data: data
                }

                state.update.loading = false
            },
            [rejected]: (state, action) => {
                const { message } = action.error

                state.update.error = message
                state.update.loading = false
            }
        }
    }

    const remove = () => {
        const { pending, fulfilled, rejected } = extraActions.remove

        return {
            [pending]: (state) => {
                state.remove.loading = true
            },
            [fulfilled]: (state, action) => {
                const { total_data, data } = action.payload

                state.remove.loading = false
                // state.remove.error = false
                state.remove.result = {
                    total: total_data,
                    data: data
                }
            },
            [rejected]: (state, action) => {
                const { message } = action.error

                state.remove.loading = false
                state.remove.error = message
            }
        }
    }

    return {
        ...getAll(),
        ...getDetail(),
        ...create(),
        ...update(),
        ...remove()
    }
}
