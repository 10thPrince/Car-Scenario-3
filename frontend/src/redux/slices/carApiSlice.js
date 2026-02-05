import { apiSlice } from "./apiSlice";

const CARS_URL = "/cars";

const getToken = () => {
  return localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo")).token
    : "";
};

export const carApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // Get all cars
    getCars: builder.query({
      query: () => ({
        url: CARS_URL,
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }),
      providesTags: ["Car"],
    }),

    // Get single car
    getCarById: builder.query({
      query: (id) => ({
        url: `${CARS_URL}/${id}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }),
      providesTags: ["Car"],
    }),

    // Create car
    createCar: builder.mutation({
      query: (data) => ({
        url: CARS_URL,
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }),
      invalidatesTags: ["Car"],
    }),

    // Update car
    updateCar: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${CARS_URL}/${id}`,
        method: "PUT",
        body: data,
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }),
      invalidatesTags: ["Car"],
    }),

    // Delete car
    deleteCar: builder.mutation({
      query: (id) => ({
        url: `${CARS_URL}/${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }),
      invalidatesTags: ["Car"],
    }),

  }),
});

export const {
  useGetCarsQuery,
  useGetCarByIdQuery,
  useCreateCarMutation,
  useUpdateCarMutation,
  useDeleteCarMutation,
} = carApiSlice;
