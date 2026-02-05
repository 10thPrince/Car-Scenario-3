import React, { useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import {
  useGetCarsQuery,
  useCreateCarMutation,
  useDeleteCarMutation,
} from "../redux/slices/carApiSlice";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";

const Car = () => {
  const { data: cars, isLoading, error } = useGetCarsQuery();
  const [createCar] = useCreateCarMutation();
  const [deleteCar] = useDeleteCarMutation();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    ownerName: "",
    phone: "",
    plateNumber: "",
    brand: "",
    model: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createCar(form).unwrap();
      toast.success("Car added successfully");
      setOpen(false);
      setForm({
        ownerName: "",
        phone: "",
        plateNumber: "",
        brand: "",
        model: "",
      });
    } catch (err) {
      toast.error(err?.data?.message || "Failed to add car");
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
          onClick={() => setOpen(true)}
          className="bg-black text-white px-4 py-2 rounded flex items-center gap-2"
          >
          <Plus size={18} /> Add Car
        </button>
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
              {cars?.map((car) => (
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
                      onClick={() => deleteHandler(car._id)}
                      className="text-red-500"
                      >
                      <Trash2 size={16}/>
                    </button>
                  </td>
                </tr>
              ))}
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
            <h2 className="text-lg font-bold mb-4">Add Car</h2>

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
                onClick={() => setOpen(false)}
                className="px-4 py-2 border border-black"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white"
                >
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

export default Car;
