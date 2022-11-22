import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetchApi from "./../helpers/fetchApi";
import history from "./../helpers/history";
import { isEmptyValue, encryptStorage } from "./../helpers/general";

// create slice
const name = 'auth'
const initialState = createInitialState()
const extraActions = createExtraActions()
const extraReducers = createExtraReducers()
const reducers = createReducers()
const slice = createSlice({ name, initialState, reducers, extraReducers })

// exports
export const authActions = { ...slice.actions, ...extraActions }
export const authReducer = slice.reducer

// implementation
function createInitialState() {
    return {
        user: encryptStorage.getItem('user'),
        error: null,
        loading: false
    }
}

function createReducers() {
    return {
        logout,
        relogin
    }

    function logout(state) {
        state.user = null
        encryptStorage.removeItem('user')
        history.navigate('/')
    }

    function relogin(state, action) {
        const { data } = action.payload
        const user = {
            ...state.user,
            ...data
        }

        state.user = user
    }
}

function createExtraActions() {
    const login = () => {
        return createAsyncThunk(
            `${name}/login`,
            async ({ username, password }) => {
                return await fetchApi.post('/token', { username, password })
            }
        )
    }

    const user = () => {
        return createAsyncThunk(
            `${name}/user`,
            async ({ id }) => {
                return await fetchApi.get(`/users/${id}`)
            }
        )
    }

    return {
        login: login(),
        user: user()
    }
}

function createExtraReducers() {
    const login = () => {
        const { pending, fulfilled, rejected } = extraActions.login

        return {
            [pending]: (state) => {
                state.error = null
                state.loading = true
            },
            [fulfilled]: (state, action) => {
                const { data } = action.payload

                state.user = data
            },
            [rejected]: (state, action) => {
                state.error = { message: 'Unauthorized' }
                state.loading = false
            }
        }
    }

    const user = () => {
        const { pending, fulfilled, rejected } = extraActions.user

        return {
            [pending]: (state) => {
                state.error = null
            },
            [fulfilled]: (state, action) => {
                const { data } = action.payload

                const user = {
                    ...state.user,
                    ...data
                }

                encryptStorage.setItem('user', user)
                state.user = user
                state.loading = false

                const { from } = history.location.state || { from: history.location }
                history.navigate(from)
            },
            [rejected]: (state, action) => {
                state.error = { message: 'Unauthorized' }
                state.loading = false
            }
        }
    }

    return {
        ...login(),
        ...user()
    }
}
