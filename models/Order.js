import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {type: String, required: true, ref:"user"},
    items: [{
        product: {type: String, required: true, ref:"product"},
        quantity: {type: Number, required: true},
    }],
    amount: {type: Number, required: true},
    address: {type: mongoose.Schema.Types.Mixed, required: true}, // Store as JSON object
    status: {type: String, required: true, default: "Order Placed"},
    date: {type: Number, required: true},
    paymentMethod: {type: String, required: true, enum: ['esewa', 'khalti']}
})

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema)

export default Order