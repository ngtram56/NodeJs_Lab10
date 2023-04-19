import {createSlice} from '@reduxjs/toolkit'
import serverAPI from "../services/serverAPI"

export const userSlice = createSlice({
    name: 'user',
    initialState: null,
    reducers: {
        addNotification: (state, {payload}) => {
            if(state.newMessages[payload]){
                state.newMessages[payload] = state.newMessages[payload] + 1
            } else {
                state.newMessages[payload] = 1
            }
        },
        resetNotification: (state, {payload}) => {
            delete state.newMessages[payload]
        },
    },
    extraReducers: (builder) => {
        // save user after signup
        builder.addMatcher(serverAPI.endpoints.signupUser.matchFulfilled, (state, {payload}) => payload)
        // save user after login
        builder.addMatcher(serverAPI.endpoints.loginUser.matchFulfilled, (state, {payload}) => payload)
        // logout: destroy user session
        builder.addMatcher(serverAPI.endpoints.logoutUser.matchFulfilled, () => null)

    }
})


export const {addNotification, resetNotification} = userSlice.actions
export default userSlice.reducer