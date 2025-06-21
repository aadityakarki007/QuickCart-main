import mongoose from "mongoose"; // ✅ correct spelling

const reviewSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    date: { type: Number, required: true }
});

const productSchema = new mongoose.Schema({
    userId: { type: String, required: true, ref: "user" },
    sellerName: { type: String, default: "" },
    name: { type: String, required: true },
    description: { type: String, required: true },
    brand: { type: String, default: "Generic" },
    color: { type: String, default: "Multi" },
    price: { type: Number, required: true },
    offerPrice: { type: Number, required: true },
    shippingFee: { type: Number, default: 15 },
    deliveryCharge: { type: Number, default: 80 },
    images: { type: Array, required: true },
    category: { type: String, required: true },
    // --- Add these fields ---
    stock: { type: Number, default: 0 },
    deliveryDate: { type: String, default: "" },
    warrantyDuration: { type: String, default: "" },
    returnPeriod: { type: String, default: "" },
    isPopular: { type: Boolean, default: false },
    // ------------------------
    reviews: [reviewSchema],
    averageRating: { type: Number, default: 0 },
    date: { type: Number, required: true }
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
