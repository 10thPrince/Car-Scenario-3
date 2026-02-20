import React, { useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import {
  useGetCarsQuery,
  useCreateCarMutation,
  useDeleteCarMutation,
  useUpdateCarMutation,
} from "../redux/slices/carApiSlice";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";

const initialForm = {
  ownerName: "",
  phone: "",
  plateNumber: "",
  brand: "",
  model: "",
};

const Car = () => {
  const { data: cars, isLoading, error } = useGetCarsQuery();
  const [createCar] = useCreateCarMutation();
  const [deleteCar] = useDeleteCarMutation();
  const [updateCar] = useUpdateCarMutation();

  const [open, setOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState(initialForm);

  const filteredCars = (cars || []).filter((car) => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return true;

    return [
      car.plateNumber,
      car.ownerName,
      car.phone,
      car.brand,
      car.model,
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query));
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openCreate = () => {
    setEditingCar(null);
    setForm(initialForm);
    setOpen(true);
  };

  const openEdit = (car) => {
    setEditingCar(car);
    setForm({
      ownerName: car.ownerName || "",
      phone: car.phone || "",
      plateNumber: car.plateNumber || "",
      brand: car.brand || "",
      model: car.model || "",
    });
    setOpen(true);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      if (editingCar) {
        await updateCar({ id: editingCar._id, ...form }).unwrap();
        toast.success("Car updated successfully");
      } else {
        await createCar(form).unwrap();
        toast.success("Car added successfully");
      }
      setOpen(false);
      setEditingCar(null);
      setForm(initialForm);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save car");
    }
  };

  const deleteHandler = async (id) => {
    if (!window.confirm("Delete this car?")) return;

    try {
      await deleteCar(id).unwrap();
      toast.success("Car deleted");
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
        <h1 className="text-2xl font-bold text-black">Cars</h1>
        <button
          onClick={openCreate}
          className="btn btn-primary"
          >
          <Plus size={18} /> Add Car
        </button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by plate, owner name, phone, brand, or model..."
          className="w-full border border-black px-3 py-2 outline-none focus:bg-yellow-50"
        />
      </div>

      {/* Table */}
      {isLoading ? (
          <p className="text-black">Loading...</p>
        ) : error ? (
            <p className="text-red-500">Error loading cars</p>
      ) : (
        <div className="overflow-x-auto border border-black">
          <table className="w-full text-sm">
            <thead className="bg-black text-white">
              <tr>
                <th className="p-3 text-left">Plate</th>
                <th className="p-3 text-left">Owner</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Brand</th>
                <th className="p-3 text-left">Model</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCars.map((car) => (
                  <tr
                  key={car._id}
                  className="border-t border-black hover:bg-gray-100"
                  >
                  <td className="p-3">{car.plateNumber}</td>
                  <td className="p-3">{car.ownerName}</td>
                  <td className="p-3">{car.phone}</td>
                  <td className="p-3">{car.brand}</td>
                  <td className="p-3">{car.model}</td>
                  <td className="p-3 flex gap-3">
                    <button
                      onClick={() => openEdit(car)}
                      className="btn btn-icon text-blue-600 hover:bg-blue-50"
                      title="Edit"
                    >
                      <Pencil size={16}/>
                    </button>
                    <button
                      onClick={() => deleteHandler(car._id)}
                      className="btn btn-icon text-red-500 hover:bg-red-50"
                      >
                      <Trash2 size={16}/>
                    </button>
                  </td>
                </tr>
              ))}
              {filteredCars.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-600">
                    No cars match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {open && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <form
            onSubmit={submitHandler}
            className="bg-white p-6 w-full max-w-md border border-black"
            >
            <h2 className="text-lg font-bold mb-4">
              {editingCar ? "Edit Car" : "Add Car"}
            </h2>

            {[
                "ownerName",
                "phone",
                "plateNumber",
                "brand",
                "model",
                
            ].map((field) => (
                <input
                key={field}
                name={field}
                placeholder={field}
                value={form[field]}
                onChange={handleChange}
                className="w-full mb-3 p-2 border border-black outline-none"
                required
                />
            ))}

            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setEditingCar(null);
                  setForm(initialForm);
                }}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                >
                {editingCar ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
      </>
  );
};

export default Car;
