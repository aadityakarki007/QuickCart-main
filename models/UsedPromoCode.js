import mongoose from "mongoose";

const usedPromoCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  usedBy: { type: String, required: true }, // userId or email
  usedAt: { type: Date, default: Date.now }
});

export default mongoose.models.UsedPromoCode || mongoose.model("UsedPromoCode", usedPromoCodeSchema);