import { apiSlice } from "./apiSlice.js";

const USER_URL = '/user';

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (data) => ({
                url: `${USER_URL}/`,
                method: 'POST',
                body: data
            })
        })
    })
})

export const {useRegisterMutation} = authApiSlice