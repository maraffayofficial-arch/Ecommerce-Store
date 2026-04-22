import mongoose from "mongoose"

const settingsSchema = mongoose.Schema({
    shippingFee: { type: Number, default: 199 },
    freeShipping: { type: Boolean, default: false },
    globalSale: { type: Number, default: 0, min: 0, max: 100 },
    specialMenu: [{ type: mongoose.Schema.Types.ObjectId, ref: 'product_collection' }],
    saleBanner: {
        enabled: { type: Boolean, default: false },
        title: { type: String, default: '' },
        subtitle: { type: String, default: '' },
        bgColor: { type: String, default: 'green' },
        imageUrl: { type: String, default: '' },
    },
}, { timestamps: true })

const settingsModel = mongoose.model("settings_collection", settingsSchema)
export default settingsModel
