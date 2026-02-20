import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import PaymentsPanel from "../components/PaymentsPanel";
import { useGetServiceByIdQuery, useUpdateServiceMutation } from "../redux/slices/serviceApiSlice";
import {
  useCreateInvoiceMutation,
  useGetInvoiceByServiceQuery,
} from "../redux/slices/invoiceApiSlice";

const normalizeParts = (partsUsed) => {
  if (!partsUsed || typeof partsUsed !== "string") return [];
  try {
    const parsed = JSON.parse(partsUsed);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item) => {
        const name = item.name || item.part || item.description || "Part";
        const qty = Number(item.qty ?? item.quantity ?? item.count ?? 1);
        const price = Number(item.price ?? item.unitPrice ?? item.cost ?? 0);
        return {
          name,
          qty: Number.isFinite(qty) ? qty : 1,
          price: Number.isFinite(price) ? price : 0,
        };
      })
      .filter((item) => item.name);
  } catch {
    return [];
  }
};

const formatMoney = (value) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return "-";
  return `$${num.toFixed(2)}`;
};

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: service, isLoading, error } = useGetServiceByIdQuery(id);
  const { data: invoice } = useGetInvoiceByServiceQuery(id, { skip: !id });
  const [createInvoice] = useCreateInvoiceMutation();
  const [updateService, { isLoading: isUpdatingStatus }] = useUpdateServiceMutation();

  const [status, setStatus] = useState("pending");

  React.useEffect(() => {
    if (service?.status) {
      setStatus(service.status);
    }
  }, [service]);

  const parts = useMemo(() => normalizeParts(service?.partsUsed), [service]);
  const partsTotal = parts.reduce(
    (sum, part) => sum + part.qty * part.price,
    0
  );
  const laborCost = Number(service?.laborCost ?? 0);
  const totalCost = Number(service?.totalCost ?? 0);
  const computedTotal = partsTotal > 0 ? laborCost + partsTotal : totalCost;
  const otherCost = partsTotal > 0 ? partsTotal : Math.max(0, totalCost - laborCost);

  const handleGenerateInvoice = async () => {
    if (!service) return;

    if (service.status !== "completed") {
      toast.warn("Service must be completed before generating an invoice");
      return;
    }

    try {
      const created = await createInvoice({ serviceId: service._id }).unwrap();
      toast.success("Invoice generated");
      navigate(`/invoice/${created._id}`);
    } catch (err) {
      if (err?.status === 409 && err?.data?.invoiceId) {
        navigate(`/invoice/${err.data.invoiceId}`);
        return;
      }
      toast.error(err?.data?.message || "Failed to generate invoice");
    }
  };

  const handleStatusUpdate = async () => {
    if (!service?._id) return;

    try {
      await updateService({ id: service._id, status }).unwrap();
      toast.success("Service status updated");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update status");
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6 bg-white min-h-screen">
        {isLoading ? (
          <p className="text-black">Loading...</p>
        ) : error ? (
          <p className="text-red-500">Error loading service</p>
        ) : service ? (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="border border-black p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-black">Service Details</h1>
                <p className="text-sm text-gray-600 mt-1">#{service._id}</p>
              </div>
              <div className="flex flex-col md:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="btn btn-outline"
                >
                  Back
                </button>
                {invoice ? (
                  <button
                    onClick={() => navigate(`/invoice/${invoice._id}`)}
                    className="btn btn-primary"
                  >
                    View Invoice
                  </button>
                ) : (
                  <button
                    onClick={handleGenerateInvoice}
                    className="btn btn-primary"
                  >
                    Generate Invoice
                  </button>
                )}
              </div>
            </div>

            <div className="border border-black p-4">
              <h2 className="text-lg font-semibold">Service Status</h2>
              <div className="mt-3 flex flex-col md:flex-row gap-3">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="border border-black px-3 py-2"
                >
                  <option value="pending">pending</option>
                  <option value="ongoing">ongoing</option>
                  <option value="completed">completed</option>
                </select>
                <button
                  onClick={handleStatusUpdate}
                  className="btn btn-primary"
                  disabled={isUpdatingStatus}
                >
                  {isUpdatingStatus ? "Updating..." : "Update Status"}
                </button>
              </div>
            </div>

            <div className="border border-black p-4">
              <h2 className="text-lg font-semibold">Car Info</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 text-sm">
                <div>
                  Plate: <strong>{service?.car?.plateNumber || "-"}</strong>
                </div>
                <div>
                  Owner: <strong>{service?.car?.ownerName || "-"}</strong>
                </div>
                <div>
                  Phone: <strong>{service?.car?.phone || "-"}</strong>
                </div>
              </div>
            </div>

            <div className="border border-black p-4">
              <h2 className="text-lg font-semibold">Full Problem Description</h2>
              <p className="mt-2 text-sm">{service.workDescription || "-"}</p>
            </div>

            <div className="border border-black p-4">
              <h2 className="text-lg font-semibold">Work Done</h2>
              <p className="mt-2 text-sm">{service.notes || "-"}</p>
            </div>

            <div className="border border-black p-4">
              <h2 className="text-lg font-semibold">Parts Breakdown</h2>
              <div className="mt-3 text-sm space-y-2">
                {parts.length ? (
                  <>
                    {parts.map((part, index) => (
                      <div key={`${part.name}-${index}`}>
                        {part.name}: {part.qty} × {formatMoney(part.price)}
                      </div>
                    ))}
                    <div>
                      Parts Total: <strong>{formatMoney(partsTotal)}</strong>
                    </div>
                  </>
                ) : (
                  <div>{service.partsUsed || "-"}</div>
                )}
              </div>
            </div>

            <div className="border border-black p-4">
              <h2 className="text-lg font-semibold">Costs</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 text-sm">
                <div>
                  Labor: <strong>{formatMoney(laborCost)}</strong>
                </div>
                <div>
                  Other: <strong>{formatMoney(otherCost)}</strong>
                </div>
                <div>
                  Total (auto): <strong>{formatMoney(computedTotal)}</strong>
                </div>
              </div>
            </div>

            <div className="border border-black p-4">
              <h2 className="text-lg font-semibold">Timeline</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 text-sm">
                <div>
                  Created: {service.createdAt ? new Date(service.createdAt).toLocaleString() : "-"}
                </div>
                <div>
                  Updated: {service.updatedAt ? new Date(service.updatedAt).toLocaleString() : "-"}
                </div>
              </div>
            </div>

            <PaymentsPanel
              serviceId={service._id}
              totalCost={service.totalCost}
              amountPaid={service.amountPaid}
            />
          </div>
        ) : (
          <p className="text-black">Service not found.</p>
        )}
      </div>
    </>
  );
};

export default ServiceDetails;


