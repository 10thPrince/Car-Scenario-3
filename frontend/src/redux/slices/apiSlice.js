import { createApi } from '@reduxjs/toolkit/query'
import {fetchBaseQuery} from '@reduxjs/toolkit/query/react' 

const baseQuery = fetchBaseQuery({baseUrl: import.meta.env.VITE_API_URL})

export const apiSlice = createApi({
    baseQuery,
    tagTypes: ['User'],
    endpoints: (builder) => {},
})