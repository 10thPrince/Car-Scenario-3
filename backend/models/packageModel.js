import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    packageNumber: {
      type: String,
      required: true,
      trim: true,
    },
    packageName: {
      type: String,
      required: true,
      trim: true,
    },
    packageDescription: {
      type: String,
      required: true,
      trim: true,
    },
    packagePrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

packageSchema.index({ user: 1, packageNumber: 1 }, { unique: true });

const Package = mongoose.model("Package", packageSchema);

export default Package;

