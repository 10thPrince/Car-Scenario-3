import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  useCreatePaymentMutation,
  useDeletePaymentMutation,
  useGetPaymentsByServiceQuery,
} from "../redux/slices/paymentApiSlice";

const formatMoney = (value) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return "-";
  return `$${num.toFixed(2)}`;
};

const PaymentsPanel = ({ serviceId, totalCost, amountPaid }) => {
  const { data: payments, isLoading, error } = useGetPaymentsByServiceQuery(
    serviceId,
    { skip: !serviceId }
  );
  const [createPayment] = useCreatePaymentMutation();
  const [deletePayment] = useDeletePaymentMutation();

  const [amount, setAmount] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      toast.error("Enter a valid payment amount");
      return;
    }

    try {
      await createPayment({ serviceId, amount: numericAmount }).unwrap();
      toast.success("Payment added");
      setAmount("");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to add payment");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this payment?")) return;

    try {
      await deletePayment(id).unwrap();
      toast.success("Payment deleted");
    } catch (err) {
      toast.error(err?.data?.message || "Delete failed");
    }
  };

  const totalPaid = Number(amountPaid ?? 0);
  const balance = Math.max(0, Number(totalCost || 0) - totalPaid);

  return (
    <div className="border border-black p-4">
      <h2 className="text-lg font-semibold">Payments</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 text-sm">
        <div>
          Total Cost: <strong>{formatMoney(totalCost)}</strong>
        </div>
        <div>
          Total Paid: <strong>{formatMoney(totalPaid)}</strong>
        </div>
        <div>
          Balance: <strong>{formatMoney(balance)}</strong>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 mt-4">
        <input
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Payment amount"
          className="border border-black px-3 py-2 w-full md:w-64"
        />
        <button type="submit" className="btn btn-primary">
          Add Payment
        </button>
      </form>

      <div className="mt-4">
        {isLoading ? (
          <p className="text-black">Loading payments...</p>
        ) : error ? (
          <p className="text-red-500">Error loading payments</p>
        ) : payments?.length ? (
          <div className="overflow-x-auto border border-black">
            <table className="w-full text-sm">
              <thead className="bg-black text-white">
                <tr>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr
                    key={payment._id}
                    className="border-t border-black hover:bg-gray-100"
                  >
                    <td className="p-3">
                      {payment.createdAt
                        ? new Date(payment.createdAt).toLocaleString()
                        : "-"}
                    </td>
                    <td className="p-3">{formatMoney(payment.amount)}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDelete(payment._id)}
                        className="btn btn-icon text-red-500 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-black">No payments yet.</p>
        )}
      </div>
    </div>
  );
};

export default PaymentsPanel;
