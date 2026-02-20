import { apiSlice } from "./apiSlice";

const PACKAGES_URL = "/packages";

const getToken = () => {
  return localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo")).token
    : "";
};

export const packageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPackages: builder.query({
      query: () => ({
        url: PACKAGES_URL,
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }),
      providesTags: ["Package"],
    }),
    createPackage: builder.mutation({
      query: (data) => ({
        url: PACKAGES_URL,
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }),
      invalidatesTags: ["Package"],
    }),
    updatePackage: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${PACKAGES_URL}/${id}`,
        method: "PUT",
        body: data,
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }),
      invalidatesTags: ["Package"],
    }),
    deletePackage: builder.mutation({
      query: (id) => ({
        url: `${PACKAGES_URL}/${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }),
      invalidatesTags: ["Package"],
    }),
  }),
});

export const {
  useGetPackagesQuery,
  useCreatePackageMutation,
  useUpdatePackageMutation,
  useDeletePackageMutation,
} = packageApiSlice;

