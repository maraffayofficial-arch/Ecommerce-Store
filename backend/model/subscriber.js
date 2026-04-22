import mongoose from "mongoose"

const subscriberSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
}, { timestamps: true })

const subscriberModel = mongoose.model("subscriber_collection", subscriberSchema)
export default subscriberModel
