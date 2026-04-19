import mongoose from "mongoose"

const cartSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user_Collection", required: true, unique: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "product_collection", required: true },
            quantity: { type: Number, required: true, min: 1, default: 1 }
        }
    ]
}, { timestamps: true })

const cartModel = mongoose.model("cart_collection", cartSchema)
export default cartModel
