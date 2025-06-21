import mongoose from "mongoose";

const popularProductSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, unique: true },
  markedBy: { type: String }, // admin or seller email/id (optional)
  markedAt: { type: Date, default: Date.now }
});

export default mongoose.models.PopularProduct || mongoose.model("PopularProduct", popularProductSchema);