import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'


// define a service user a base URL
const serverAPI = createApi({
    reducerPath: 'serverAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:5050", 
    }),
    endpoints: (builder) => ({
        // Create account
        signupUser: builder.mutation({
            query: (user) => ({
                url: '/api/users',
                method: 'POST',
                body: user,
            }),
        }),

        // Login
        loginUser: builder.mutation({
            query: (user) => ({
                url: '/api/users/login',
                method: 'POST',
                body: user,
            }),
        }),

        // Logout
        logoutUser: builder.mutation({
            query: (payload) => ({
                url: '/logout',
                method: "DELETE",
                body: payload,
            }),
        }),


    }),
})

export const {useSignupUserMutation, useLoginUserMutation, useLogoutUserMutation} = serverAPI

export default serverAPI