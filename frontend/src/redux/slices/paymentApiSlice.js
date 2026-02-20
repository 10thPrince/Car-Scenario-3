import { apiSlice } from "./apiSlice";

const PAYMENTS_URL = "/payments";

const getToken = () => {
  return localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo")).token
    : "";
};

export const paymentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // Get all payments
    getPayments: builder.query({
      query: () => ({
        url: PAYMENTS_URL,
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }),
      providesTags: ["Payment"],
    }),

    // Get single payment
    getPaymentById: builder.query({
      query: (id) => ({
        url: `${PAYMENTS_URL}/${id}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }),
      providesTags: ["Payment"],
    }),

    // Get payments by service
    getPaymentsByService: builder.query({
      query: (serviceId) => ({
        url: `${PAYMENTS_URL}/service/${serviceId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }),
      providesTags: ["Payment"],
    }),

    // Get payments by car
    getPaymentsByCar: builder.query({
      query: (carId) => ({
        url: `${PAYMENTS_URL}/car/${carId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }),
      providesTags: ["Payment"],
    }),

    // Create payment
    createPayment: builder.mutation({
      query: (data) => ({
        url: PAYMENTS_URL,
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }),
      invalidatesTags: ["Payment", "Service"],
    }),

    // Delete payment
    deletePayment: builder.mutation({
      query: (id) => ({
        url: `${PAYMENTS_URL}/${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }),
      invalidatesTags: ["Payment", "Service"],
    }),

  }),
});

export const {
  useGetPaymentsQuery,
  useGetPaymentByIdQuery,
  useGetPaymentsByServiceQuery,
  useGetPaymentsByCarQuery,
  useCreatePaymentMutation,
  useDeletePaymentMutation,
} = paymentApiSlice;
