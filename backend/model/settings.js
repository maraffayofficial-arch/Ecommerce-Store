import mongoose from "mongoose"

const settingsSchema = mongoose.Schema({
    shippingFee: { type: Number, default: 199 },
    freeShipping: { type: Boolean, default: false },
}, { timestamps: true })

const settingsModel = mongoose.model("settings_collection", settingsSchema)
export default settingsModel
