import mongoose from "mongoose"; 

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
    shippingFee: { type: Number, default: 0 },
    deliveryCharge: { type: Number, default: 0 },
    images: { type: Array, required: true },
    category: { type: String, required: true },
    reviews: [reviewSchema],
    averageRating: { type: Number, default: 0 },
    date: { type: Number, required: true }, 
    isPopular: {
        type: Boolean,
        default: false
    }
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product
