import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetchApi from "./../helpers/fetchApi";
import { PaginationInfo } from "./../helpers/pagination";
import { isEmptyValue } from "./../helpers/general";

// create slice
const name = 'users'
const initialState = createInitialState()
const extraActions = createExtraActions()
const extraReducers = createExtraReducers()
const slice = createSlice({ name, initialState, extraReducers })

// exports
export const usersActions = { ...slice.actions, ...extraActions }
export const usersReducer = slice.reducer

// implementation
function createInitialState() {
    return {
        result: {},
        error: null,
        loading: false
    }
}

function createExtraActions() {
    const endpoint = '/users'

    return {
        getAll: getAll(),
        // getDetail: getDetail(),
        // create: create(),
        // update: update(),
        // remove: remove()
    }

    function getAll() {
        return createAsyncThunk(
            `${name}/getAll`,
            async () => await fetchApi.get(endpoint)
        );
    }
}

function createExtraReducers() {
    return {
        ...getAll(),
        // ...getDetail(),
        // ...create(),
        // ...update(),
        // ...remove()
    };

    function getAll() {
        var { pending, fulfilled, rejected } = extraActions.getAll;
        return {
            [pending]: (state) => {
                state.loading = true
            },
            [fulfilled]: (state, action) => {
                const { total_data, data, paging } = action.payload

                state.result = { total_data, data }

                if (paging) {
                    const pagingInfo = PaginationInfo({
                        total: total_data,
                        limit: 20,
                        current: paging.current
                    })

                    state.result.paging = {
                        ...paging,
                        index: pagingInfo.index
                    }
                }

                state.loading = false
            },
            [rejected]: (state, action) => {
                state.error = action.error
                state.loading = false
            }
        };
    }
}
