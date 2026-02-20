import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetInvoiceByIdQuery } from "../redux/slices/invoiceApiSlice";
import { useGetServiceByIdQuery } from "../redux/slices/serviceApiSlice";

const formatMoney = (value) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return "-";
  return `$${num.toFixed(2)}`;
};

const InvoicePrint = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: invoice, isLoading, error } = useGetInvoiceByIdQuery(id);
  const { data: service } = useGetServiceByIdQuery(invoice?.service, {
    skip: !invoice?.service,
  });

  React.useEffect(() => {
    if (error) {
      toast.error(error?.data?.message || "Failed to load invoice");
    }
  }, [error]);

  const totalCost = Number(invoice?.serviceSnapshot?.totalCost || 0);
  const laborCost = Number(invoice?.serviceSnapshot?.laborCost || 0);
  const otherCost = Number(invoice?.serviceSnapshot?.otherCost || 0);
  const amountPaid = Number(service?.amountPaid ?? invoice?.paymentSnapshot?.amountPaid ?? 0);
  const remaining = Math.max(0, totalCost - amountPaid);
  const paymentStatus =
    service?.paymentStatus ||
    (remaining <= 0 && totalCost > 0 ? "paid" : amountPaid > 0 ? "partial" : "unpaid");
  const isPaid = paymentStatus === "paid";

  return (
    <div className="bg-white min-h-screen text-black p-6">
      <style>
        {`@media print {
          .no-print { display: none !important; }
          body { margin: 0; }
        }`}
      </style>

      {isLoading ? (
        <p>Loading invoice...</p>
      ) : !invoice ? (
        <p>Invoice not found.</p>
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="no-print mb-4">
            <button type="button" onClick={() => navigate(-1)} className="btn btn-outline">
              Back
            </button>
          </div>

          <div className="flex items-start justify-between border-b border-black pb-4">
            <div>
              <h1 className="text-3xl font-bold">Car Manager</h1>
              <p className="text-sm text-gray-600">Invoice</p>
            </div>
            <div className="text-right text-sm">
              <p className="font-semibold">{invoice.invoiceNumber}</p>
              <p>Issued: {invoice.issuedAt ? new Date(invoice.issuedAt).toLocaleDateString() : "-"}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="border border-black p-4">
              <h2 className="font-semibold text-lg">Customer</h2>
              <p className="mt-2">{invoice.customerSnapshot?.ownerName || "-"}</p>
              <p>{invoice.customerSnapshot?.phone || "-"}</p>
            </div>
            <div className="border border-black p-4">
              <h2 className="font-semibold text-lg">Vehicle</h2>
              <p className="mt-2">
                {invoice.customerSnapshot?.plateNumber || "-"}
              </p>
              <p>
                {invoice.customerSnapshot?.brand || ""} {invoice.customerSnapshot?.model || ""}
              </p>
              <p>
                {invoice.customerSnapshot?.year || "-"} {invoice.customerSnapshot?.color || ""}
              </p>
            </div>
          </div>

          <div className="border border-black p-4 mt-6">
            <h2 className="font-semibold text-lg">Service</h2>
            <p className="mt-2"><strong>Problem:</strong> {invoice.serviceSnapshot?.problem || "-"}</p>
            <p className="mt-2"><strong>Work Done:</strong> {invoice.serviceSnapshot?.workDone || "-"}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="border border-black p-4">
              <h2 className="font-semibold text-lg">Costs Summary</h2>
              <div className="mt-3 text-sm space-y-2">
                <p>Labor: <strong>{formatMoney(laborCost)}</strong></p>
                <p>Other: <strong>{formatMoney(otherCost)}</strong></p>
                <p>Total: <strong>{formatMoney(totalCost)}</strong></p>
              </div>
            </div>
            <div className="border border-black p-4">
              <h2 className="font-semibold text-lg">Payment Summary</h2>
              <div className="mt-3 text-sm space-y-2">
                <p>Amount Paid: <strong>{formatMoney(amountPaid)}</strong></p>
                <p>Remaining: <strong>{formatMoney(remaining)}</strong></p>
                <p>
                  Status:{" "}
                  <strong className={`capitalize ${isPaid ? "text-green-700" : ""}`}>
                    {paymentStatus || "-"}
                  </strong>
                </p>
                {isPaid && (
                  <p className="font-semibold text-green-700">
                    This service is fully paid.
                  </p>
                )}
              </div>
            </div>
          </div>

          {invoice.notes ? (
            <div className="border border-black p-4 mt-6">
              <h2 className="font-semibold text-lg">Notes</h2>
              <p className="mt-2 text-sm">{invoice.notes}</p>
            </div>
          ) : null}

          <div className="mt-8 border-t border-black pt-6 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p>Customer Signature: ________________________</p>
              </div>
              <div>
                <p>Authorized Signature: _______________________</p>
              </div>
            </div>
            <p className="mt-6">Thank you for your business.</p>
          </div>

          <div className="no-print mt-6 flex justify-end">
            <button
              onClick={() => window.print()}
              className="btn btn-primary"
            >
              Print
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicePrint;
