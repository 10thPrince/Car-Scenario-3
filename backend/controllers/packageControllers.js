import Package from "../models/packageModel.js";

// @desc   Create package
// @route  POST /packages
// @access Private
export const createPackage = async (req, res) => {
  try {
    const { packageNumber, packageName, packageDescription, packagePrice } = req.body;

    if (!packageNumber || !packageName || !packageDescription) {
      return res.status(400).json({ message: "All package fields are required" });
    }

    const existing = await Package.findOne({
      user: req.user._id,
      packageNumber: String(packageNumber).trim(),
    });

    if (existing) {
      return res.status(400).json({ message: "Package number already exists" });
    }

    const created = await Package.create({
      user: req.user._id,
      packageNumber: String(packageNumber).trim(),
      packageName: String(packageName).trim(),
      packageDescription: String(packageDescription).trim(),
      packagePrice: Number(packagePrice) || 0,
    });

    res.status(201).json(created);
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "System Error Please check the Console!" });
  }
};

// @desc   Get all packages
// @route  GET /packages
// @access Private
export const getPackages = async (req, res) => {
  try {
    const packages = await Package.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(packages);
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "System Error Please check the Console!" });
  }
};

// @desc   Update package
// @route  PUT /packages/:id
// @access Private
export const updatePackage = async (req, res) => {
  try {
    const found = await Package.findOne({ _id: req.params.id, user: req.user._id });
    if (!found) {
      return res.status(404).json({ message: "Package not found" });
    }

    const incomingNumber = String(req.body.packageNumber || found.packageNumber).trim();
    if (incomingNumber !== found.packageNumber) {
      const exists = await Package.findOne({
        _id: { $ne: found._id },
        user: req.user._id,
        packageNumber: incomingNumber,
      });
      if (exists) {
        return res.status(400).json({ message: "Package number already exists" });
      }
    }

    found.packageNumber = incomingNumber;
    found.packageName = String(req.body.packageName || found.packageName).trim();
    found.packageDescription = String(
      req.body.packageDescription || found.packageDescription
    ).trim();
    found.packagePrice = Number(req.body.packagePrice ?? found.packagePrice);

    const updated = await found.save();
    res.status(200).json(updated);
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "System Error Please check the Console!" });
  }
};

// @desc   Delete package
// @route  DELETE /packages/:id
// @access Private
export const deletePackage = async (req, res) => {
  try {
    const found = await Package.findOne({ _id: req.params.id, user: req.user._id });
    if (!found) {
      return res.status(404).json({ message: "Package not found" });
    }

    await found.deleteOne();
    res.status(200).json({ message: "Package removed" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "System Error Please check the Console!" });
  }
};

