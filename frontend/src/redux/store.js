import { configureStore } from "@reduxjs/toolkit";
import authSlice from './slices/authSlice.js';
import { apiSlice } from "./slices/apiSlice.js";

export const store = configureStore({
    reducer: {
        auth: authSlice,
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
})