import { apiSlice } from "./apiSlice";

const DASHBOARD_URL = "/dashboard";

const getToken = () => {
  return localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo")).token
    : "";
};

export const dashboardApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => ({
        url: `${DASHBOARD_URL}/stats`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }),
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApiSlice;

