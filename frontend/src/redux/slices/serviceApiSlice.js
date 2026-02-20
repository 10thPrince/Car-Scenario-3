import { apiSlice } from "./apiSlice";

const SERVICES_URL = "/services";

const getToken = () => {
  return localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo")).token
    : "";
};

export const serviceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // Get all services
    getServices: builder.query({
      query: () => ({
        url: SERVICES_URL,
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }),
      providesTags: ["Service"],
    }),

    // Get single service
    getServiceById: builder.query({
      query: (id) => ({
        url: `${SERVICES_URL}/${id}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }),
      providesTags: ["Service"],
    }),

    // Get services by car
    getServicesByCar: builder.query({
      query: (carId) => ({
        url: `${SERVICES_URL}/car/${carId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }),
      providesTags: ["Service"],
    }),

    // Create service
    createService: builder.mutation({
      query: (data) => ({
        url: SERVICES_URL,
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }),
      invalidatesTags: ["Service"],
    }),

    // Update service
    updateService: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${SERVICES_URL}/${id}`,
        method: "PUT",
        body: data,
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }),
      invalidatesTags: ["Service"],
    }),

    // Delete service
    deleteService: builder.mutation({
      query: (id) => ({
        url: `${SERVICES_URL}/${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }),
      invalidatesTags: ["Service"],
    }),

  }),
});

export const {
  useGetServicesQuery,
  useGetServiceByIdQuery,
  useGetServicesByCarQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = serviceApiSlice;
