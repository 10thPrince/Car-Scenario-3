import React, { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import {
  useCreatePackageMutation,
  useDeletePackageMutation,
  useGetPackagesQuery,
  useUpdatePackageMutation,
} from "../redux/slices/packageApiSlice";

const initialForm = {
  packageNumber: "",
  packageName: "",
  packageDescription: "",
  packagePrice: "",
};

const Package = () => {
  const { data: packages = [], isLoading, error } = useGetPackagesQuery();
  const [createPackage] = useCreatePackageMutation();
  const [updatePackage] = useUpdatePackageMutation();
  const [deletePackage] = useDeletePackageMutation();

  const [open, setOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [form, setForm] = useState(initialForm);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openCreate = () => {
    setEditingPackage(null);
    setForm(initialForm);
    setOpen(true);
  };

  const openEdit = (pkg) => {
    setEditingPackage(pkg);
    setForm({
      packageNumber: pkg.packageNumber || "",
      packageName: pkg.packageName || "",
      packageDescription: pkg.packageDescription || "",
      packagePrice: String(pkg.packagePrice ?? ""),
    });
    setOpen(true);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      packagePrice: Number(form.packagePrice || 0),
    };

    try {
      if (editingPackage) {
        await updatePackage({ id: editingPackage._id, ...payload }).unwrap();
        toast.success("Package updated successfully");
      } else {
        await createPackage(payload).unwrap();
        toast.success("Package created successfully");
      }
      setOpen(false);
      setEditingPackage(null);
      setForm(initialForm);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save package");
    }
  };

  const deleteHandler = async (id) => {
    if (!window.confirm("Delete this package?")) return;
    try {
      await deletePackage(id).unwrap();
      toast.success("Package deleted");
    } catch (err) {
      toast.error(err?.data?.message || "Delete failed");
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6 bg-white min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-black">Packages</h1>
          <button type="button" onClick={openCreate} className="btn btn-primary">
            <Plus size={18} /> Add Package
          </button>
        </div>

        {isLoading ? (
          <p className="text-black">Loading...</p>
        ) : error ? (
          <p className="text-red-500">Error loading packages</p>
        ) : packages.length ? (
          <div className="overflow-x-auto border border-black">
            <table className="w-full text-sm">
              <thead className="bg-black text-white">
                <tr>
                  <th className="p-3 text-left">Package Number</th>
                  <th className="p-3 text-left">Package Name</th>
                  <th className="p-3 text-left">Package Description</th>
                  <th className="p-3 text-left">Package Price</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {packages.map((pkg) => (
                  <tr key={pkg._id} className="border-t border-black hover:bg-gray-100">
                    <td className="p-3">{pkg.packageNumber}</td>
                    <td className="p-3">{pkg.packageName}</td>
                    <td className="p-3">{pkg.packageDescription}</td>
                    <td className="p-3">${Number(pkg.packagePrice || 0).toFixed(2)}</td>
                    <td className="p-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(pkg)}
                        className="btn btn-icon text-blue-600 hover:bg-blue-50"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteHandler(pkg._id)}
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
          <p className="text-black">No packages yet.</p>
        )}

        {open && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <form onSubmit={submitHandler} className="bg-white p-6 w-full max-w-md border border-black">
              <h2 className="text-lg font-bold mb-4">{editingPackage ? "Edit Package" : "Add Package"}</h2>
              <input
                name="packageNumber"
                value={form.packageNumber}
                onChange={handleChange}
                placeholder="Package Number"
                className="w-full mb-3 p-2 border border-black outline-none"
                required
              />
              <input
                name="packageName"
                value={form.packageName}
                onChange={handleChange}
                placeholder="Package Name"
                className="w-full mb-3 p-2 border border-black outline-none"
                required
              />
              <textarea
                name="packageDescription"
                value={form.packageDescription}
                onChange={handleChange}
                placeholder="Package Description (list included services)"
                className="w-full mb-3 p-2 border border-black outline-none"
                required
              />
              <input
                type="number"
                min="0"
                step="0.01"
                name="packagePrice"
                value={form.packagePrice}
                onChange={handleChange}
                placeholder="Package Price"
                className="w-full mb-3 p-2 border border-black outline-none"
                required
              />

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setEditingPackage(null);
                    setForm(initialForm);
                  }}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingPackage ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default Package;

