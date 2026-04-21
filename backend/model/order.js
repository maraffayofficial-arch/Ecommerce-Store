import mongoose from "mongoose"

const orderSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user_Collection", default: null },
    guestOrder: { type: Boolean, default: false },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "product_collection" },
            title: String,
            price: Number,
            image: String,
            quantity: Number
        }
    ],
    totalAmount: { type: Number, required: true },
    address: {
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        city: { type: String, required: true },
        street: { type: String, required: true },
        postalCode: { type: String, default: "" },
        email: { type: String, default: "" }
    },
    paymentMethod: { type: String, enum: ["cod", "bank_transfer", "jazzcash", "easypaisa"], default: "cod" },
    transactionId: { type: String, default: "" },
    newsletterOptIn: { type: Boolean, default: false },
    status: { type: String, enum: ["pending", "processing", "shipped", "delivered", "cancelled"], default: "pending" }
}, { timestamps: true })

const orderModel = mongoose.model("order_collection", orderSchema)
export default orderModel
