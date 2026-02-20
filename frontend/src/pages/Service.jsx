import React, { useState } from "react";
import { Plus, Trash2, Pencil, Eye } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useGetCarsQuery } from "../redux/slices/carApiSlice";
import { useGetPackagesQuery } from "../redux/slices/packageApiSlice";
import {
  useCreateServiceMutation,
  useDeleteServiceMutation,
  useGetServicesQuery,
  useUpdateServiceMutation,
} from "../redux/slices/serviceApiSlice";

const initialForm = {
  carId: "",
  packageId: "",
  workDescription: "",
  partsUsed: "",
  laborCost: "",
  otherCost: "",
  status: "pending",
  notes: "",
};

const toNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

const Service = () => {
  const navigate = useNavigate();
  const { data: services, isLoading, error } = useGetServicesQuery();
  const { data: cars } = useGetCarsQuery();
  const { data: packages = [] } = useGetPackagesQuery();

  const [createService] = useCreateServiceMutation();
  const [updateService] = useUpdateServiceMutation();
  const [deleteService] = useDeleteServiceMutation();

  const [open, setOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState(initialForm);

  const filteredServices = (services || []).filter((service) => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return true;

    return [
      service?.car?.plateNumber,
      service?.car?.ownerName,
      service?.car?.brand,
      service?.car?.model,
      service?.workDescription,
      service?.status,
      service?.notes,
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query));
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePackageChange = (e) => {
    const packageId = e.target.value;
    const selectedPackage = packages.find((pkg) => pkg._id === packageId);

    if (!selectedPackage) {
      setForm((prev) => ({
        ...prev,
        packageId: "",
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      packageId,
      notes: selectedPackage.packageDescription || prev.notes,
      laborCost: Number(selectedPackage.packagePrice || 0),
      otherCost: 0,
    }));
  };

  const openCreate = () => {
    setEditingService(null);
    setForm(initialForm);
    setOpen(true);
  };

  const openEdit = (service) => {
    const laborCost = toNumber(service?.laborCost ?? 0);
    const totalCost = toNumber(service?.totalCost ?? 0);
    const derivedOtherCost = Math.max(0, totalCost - laborCost);

    setEditingService(service);
    setForm({
      carId: service?.car?._id || service?.car || "",
      packageId: service?.package?._id || service?.package || "",
      workDescription: service?.workDescription || "",
      partsUsed: service?.partsUsed || "",
      laborCost: laborCost,
      otherCost: derivedOtherCost,
      status: service?.status || "pending",
      notes: service?.notes || "",
    });
    setOpen(true);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const laborCost = toNumber(form.laborCost);
    const otherCost = toNumber(form.otherCost);
    const totalCost = laborCost + otherCost;

    const payload = {
      packageId: form.packageId || "",
      workDescription: form.workDescription.trim(),
      partsUsed: form.partsUsed,
      laborCost,
      totalCost,
      status: form.status,
      notes: form.notes,
    };

    try {
      if (editingService) {
        await updateService({ id: editingService._id, ...payload }).unwrap();
        toast.success("Service updated successfully");
      } else {
        await createService({ carId: form.carId, ...payload }).unwrap();
        toast.success("Service created successfully");
      }

      setOpen(false);
      setEditingService(null);
      setForm(initialForm);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save service");
    }
  };

  const deleteHandler = async (id) => {
    if (!window.confirm("Delete this service?")) return;

    try {
      await deleteService(id).unwrap();
      toast.success("Service deleted");
    } catch (err) {
      toast.error(err?.data?.message || "Delete failed");
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6 bg-white min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-black">Services</h1>
          <button
            onClick={openCreate}
            className="btn btn-primary"
          >
            <Plus size={18} /> Add Service
          </button>
        </div>
        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by car plate, owner name, work description, or status..."
            className="w-full border border-black px-3 py-2 outline-none focus:bg-yellow-50"
          />
        </div>

        {/* Table */}
        {isLoading ? (
          <p className="text-black">Loading...</p>
        ) : error ? (
          <p className="text-red-500">Error loading services</p>
        ) : filteredServices.length ? (
          <div className="overflow-x-auto border border-black">
            <table className="w-full text-sm">
              <thead className="bg-black text-white">
                <tr>
                  <th className="p-3 text-left">Car</th>
                  <th className="p-3 text-left">Work</th>
                  <th className="p-3 text-left">Labor</th>
                  <th className="p-3 text-left">Total</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((service) => (
                  <tr
                    key={service._id}
                    onClick={() => navigate(`/services/${service._id}`)}
                    className="border-t border-black hover:bg-gray-100 cursor-pointer"
                  >
                    <td className="p-3">
                      {service?.car?.plateNumber || "-"}
                    </td>
                    <td className="p-3">{service.workDescription}</td>
                    <td className="p-3">${service.laborCost}</td>
                    <td className="p-3">${service.totalCost}</td>
                    <td className="p-3 capitalize">{service.status}</td>
                    <td className="p-3 flex gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/services/${service._id}`);
                        }}
                        className="btn btn-icon"
                        title="View details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEdit(service);
                        }}
                        className="btn btn-icon text-blue-600 hover:bg-blue-50"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteHandler(service._id);
                        }}
                        className="btn btn-icon text-red-500 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-black">
            {services?.length ? "No services match your search." : "No services yet."}
          </p>
        )}

        {/* Modal */}
        {open && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <form
              onSubmit={submitHandler}
              className="bg-white p-6 w-full max-w-md border border-black"
            >
              <h2 className="text-lg font-bold mb-4">
                {editingService ? "Edit Service" : "Add Service"}
              </h2>

              {!editingService && (
                <>
                  <select
                    name="carId"
                    value={form.carId}
                    onChange={handleChange}
                    className="w-full mb-3 p-2 border border-black outline-none"
                    required
                  >
                    <option value="">Select Car</option>
                    {cars?.map((car) => (
                      <option key={car._id} value={car._id}>
                        {car.plateNumber} - {car.brand} {car.model}
                      </option>
                    ))}
                  </select>
                  <select
                    name="packageId"
                    value={form.packageId}
                    onChange={handlePackageChange}
                    className="w-full mb-3 p-2 border border-black outline-none"
                  >
                    <option value="">Select Package (optional)</option>
                    {packages.map((pkg) => (
                      <option key={pkg._id} value={pkg._id}>
                        {pkg.packageNumber} - {pkg.packageName}
                      </option>
                    ))}
                  </select>
                </>
              )}

              {editingService && (
                <select
                  name="packageId"
                  value={form.packageId}
                  onChange={handlePackageChange}
                  className="w-full mb-3 p-2 border border-black outline-none"
                >
                  <option value="">Select Package (optional)</option>
                  {packages.map((pkg) => (
                    <option key={pkg._id} value={pkg._id}>
                      {pkg.packageNumber} - {pkg.packageName}
                    </option>
                  ))}
                </select>
              )}

              {form.packageId && (
                <div className="mb-3 border border-yellow-500 bg-yellow-50 p-3 text-sm">
                  {(() => {
                    const selectedPackage = packages.find((pkg) => pkg._id === form.packageId);
                    if (!selectedPackage) return <p>Selected package not found.</p>;
                    return (
                      <>
                        <p>
                          <strong>Package:</strong> {selectedPackage.packageName}
                        </p>
                        <p>
                          <strong>Description:</strong> {selectedPackage.packageDescription}
                        </p>
                        <p>
                          <strong>Price:</strong> ${Number(selectedPackage.packagePrice || 0).toFixed(2)}
                        </p>
                      </>
                    );
                  })()}
                </div>
              )}

              <textarea
                name="workDescription"
                placeholder="Full problem description"
                value={form.workDescription}
                onChange={handleChange}
                className="w-full mb-3 p-2 border border-black outline-none"
                required
              />

              <textarea
                name="partsUsed"
                placeholder='Parts used (JSON array like [{"name":"Brake pad","qty":2,"price":35}])'
                value={form.partsUsed}
                onChange={handleChange}
                className="w-full mb-3 p-2 border border-black outline-none"
              />

              <input
                type="number"
                min="0"
                name="laborCost"
                placeholder="Labor cost"
                value={form.laborCost}
                onChange={handleChange}
                className="w-full mb-3 p-2 border border-black outline-none"
                required
              />

              <input
                type="number"
                min="0"
                name="otherCost"
                placeholder="Other cost"
                value={form.otherCost}
                onChange={handleChange}
                className="w-full mb-3 p-2 border border-black outline-none"
                required
              />

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full mb-3 p-2 border border-black outline-none"
              >
                <option value="pending">pending</option>
                <option value="ongoing">ongoing</option>
                <option value="completed">completed</option>
              </select>

              <textarea
                name="notes"
                placeholder="Work done / Notes"
                value={form.notes}
                onChange={handleChange}
                className="w-full mb-3 p-2 border border-black outline-none"
              />

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setEditingService(null);
                  }}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default Service;
