import { apiSlice } from "./apiSlice";

const INVOICES_URL = "/api/invoices";

const getToken = () => {
  return localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo")).token
    : "";
};

export const invoiceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // Create invoice
    createInvoice: builder.mutation({
      query: (data) => ({
        url: INVOICES_URL,
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }),
      invalidatesTags: ["Invoice", "Service"],
    }),

    // Get all invoices
    getInvoices: builder.query({
      query: () => ({
        url: INVOICES_URL,
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }),
      providesTags: ["Invoice"],
    }),

    // Get single invoice
    getInvoiceById: builder.query({
      query: (id) => ({
        url: `${INVOICES_URL}/${id}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }),
      providesTags: ["Invoice"],
    }),

    // Get invoice by service
    getInvoiceByService: builder.query({
      query: (serviceId) => ({
        url: `${INVOICES_URL}/service/${serviceId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }),
      providesTags: ["Invoice"],
    }),

  }),
});

export const {
  useCreateInvoiceMutation,
  useGetInvoicesQuery,
  useGetInvoiceByIdQuery,
  useGetInvoiceByServiceQuery,
} = invoiceApiSlice;
