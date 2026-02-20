import React from "react";
import { Link } from "react-router-dom";
import { Car, Wrench, Clock3, CheckCircle2 } from "lucide-react";
import Navbar from "./Navbar.jsx";
import { useGetDashboardStatsQuery } from "../redux/slices/dashboardApiSlice";

const formatMoney = (value) => `$${Number(value || 0).toFixed(2)}`;

const Dashboard = () => {
  const {
    data: dashboard,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetDashboardStatsQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
  });

  const totalCars = dashboard?.totalCars ?? 0;
  const totalServices = dashboard?.totalServices ?? 0;
  const pendingServices = dashboard?.pendingServices ?? 0;
  const completedServices = dashboard?.completedServices ?? 0;
  const ongoingServices = dashboard?.ongoingServices ?? 0;
  const totalRevenue = dashboard?.totalRevenue ?? 0;
  const recentServices = dashboard?.recentServices ?? [];

  const statCards = [
    {
      label: "Total Cars",
      value: totalCars,
      icon: Car,
    },
    {
      label: "Total Services",
      value: totalServices,
      icon: Wrench,
    },
    {
      label: "Pending",
      value: pendingServices,
      icon: Clock3,
    },
    {
      label: "Completed",
      value: completedServices,
      icon: CheckCircle2,
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-yellow-50 p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-black">Dashboard</h1>
              <p className="text-sm text-gray-700">Overview of cars, services, and revenue.</p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/car"
                className="btn btn-outline"
              >
                Manage Cars
              </Link>
              <Link
                to="/services"
                className="btn btn-primary"
              >
                Manage Services
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  className="rounded border-2 border-yellow-300 bg-white p-4 shadow-sm"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">{card.label}</p>
                    <Icon size={18} className="text-yellow-600" />
                  </div>
                  <p className="text-3xl font-bold text-black">
                    {isLoading ? "..." : card.value}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded border border-yellow-300 bg-white p-5">
              <h2 className="mb-3 text-lg font-semibold text-black">Revenue</h2>
              <p className="text-sm text-gray-700">Total billed from all services</p>
              <p className="mt-2 text-3xl font-bold text-black">
                {isLoading ? "..." : formatMoney(totalRevenue)}
              </p>
            </div>

            <div className="rounded border border-yellow-300 bg-white p-5">
              <h2 className="mb-3 text-lg font-semibold text-black">Service Status</h2>
              <div className="space-y-2 text-sm text-black">
                <div className="flex items-center justify-between rounded bg-yellow-100 px-3 py-2">
                  <span>Pending</span>
                  <span className="font-semibold">{pendingServices}</span>
                </div>
                <div className="flex items-center justify-between rounded bg-yellow-100 px-3 py-2">
                  <span>Ongoing</span>
                  <span className="font-semibold">{ongoingServices}</span>
                </div>
                <div className="flex items-center justify-between rounded bg-yellow-100 px-3 py-2">
                  <span>Completed</span>
                  <span className="font-semibold">{completedServices}</span>
                </div>
                <div className="flex items-center justify-between rounded bg-yellow-100 px-3 py-2">
                  <span>Other</span>
                  <span className="font-semibold">
                    {Math.max(
                      0,
                      totalServices - pendingServices - completedServices - ongoingServices
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded border border-yellow-300 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-black">Recent Services</h2>
              <Link to="/services" className="text-sm font-semibold text-yellow-700 hover:underline">
                View all
              </Link>
            </div>

            {isLoading ? (
              <p className="text-sm text-gray-700">Loading recent services...</p>
            ) : isError ? (
              <div className="space-y-3">
                <p className="text-sm text-red-600">Failed to load dashboard data.</p>
                <button type="button" className="btn btn-outline" onClick={() => refetch()}>
                  Retry
                </button>
              </div>
            ) : recentServices.length === 0 ? (
              <p className="text-sm text-gray-700">No services yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-yellow-200 text-left">
                      <th className="p-2">Car</th>
                      <th className="p-2">Work</th>
                      <th className="p-2">Status</th>
                      <th className="p-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentServices.map((service) => (
                      <tr key={service._id} className="border-b border-yellow-100">
                        <td className="p-2">{service?.car?.plateNumber || "-"}</td>
                        <td className="p-2">{service.workDescription || "-"}</td>
                        <td className="p-2 capitalize">{service.status || "-"}</td>
                        <td className="p-2">{formatMoney(service.totalCost)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="text-right text-xs text-gray-500">
            {isFetching ? "Refreshing dashboard..." : "Dashboard data is up to date."}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
