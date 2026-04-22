import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    weight: { type: String, required: true },
    title: { type: String, required: true },
    discription: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    images: { type: [String], required: true },
    discount: { type: Number, default: 0, min: 0, max: 100 },
})

const productModel = mongoose.model("product_collection", productSchema)
export default productModel
