import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {type: String, required: true, ref:"user"},
    items: [{
        product: {type: String, required: true, ref:"Product"},
        quantity: {type: Number, required: true},
    }],
    amount: {type: Number, required: true},
    address: {type: mongoose.Schema.Types.Mixed, required: true}, // Store as JSON object
    status: {type: String, required: true, default: "Order Placed"},
    date: {type: Number, required: true},
    paymentMethod: {type: String, required: true, default: "cod"},
    originalPrice: { type: Number },
    offerPrice: { type: Number },
    totalAmount: { type: Number },
    promoCode: { type: String }, // <-- Add this line
})

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema)

export default Order