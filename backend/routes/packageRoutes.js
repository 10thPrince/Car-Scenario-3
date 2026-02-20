import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createPackage,
  deletePackage,
  getPackages,
  updatePackage,
} from "../controllers/packageControllers.js";

const router = express.Router();

router.get("/", protect, getPackages);
router.post("/", protect, createPackage);
router.put("/:id", protect, updatePackage);
router.delete("/:id", protect, deletePackage);

export default router;

