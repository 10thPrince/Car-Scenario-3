import Car from "../models/carModel.js";
import Service from "../models/serviceModel.js";

// @desc   Get dashboard stats
// @route  GET /dashboard/stats
// @access Private
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const [totalCars, statusCounts, revenueAgg, recentServices] = await Promise.all([
      Car.countDocuments({ user: userId }),
      Service.aggregate([
        { $match: { createdBy: userId } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      Service.aggregate([
        { $match: { createdBy: userId } },
        {
          $group: {
            _id: null,
            totalServices: { $sum: 1 },
            totalRevenue: { $sum: "$totalCost" },
          },
        },
      ]),
      Service.find({ createdBy: userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("car", "plateNumber brand model ownerName phone"),
    ]);

    const totalServices = revenueAgg[0]?.totalServices || 0;
    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

    const pendingServices = statusCounts.find((s) => s._id === "pending")?.count || 0;
    const completedServices = statusCounts.find((s) => s._id === "completed")?.count || 0;
    const ongoingServices = statusCounts.find((s) => s._id === "ongoing")?.count || 0;

    res.status(200).json({
      totalCars,
      totalServices,
      pendingServices,
      completedServices,
      ongoingServices,
      totalRevenue,
      recentServices,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "System Error Please check the Console!",
    });
  }
};

