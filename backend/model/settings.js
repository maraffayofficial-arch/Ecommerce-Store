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
    contactInfo: {
        email: { type: String, default: 'urbanpickle@gmail.com' },
        phone: { type: String, default: '+92 323-5073652' },
        location: { type: String, default: '26000, Multan, Pakistan' },
    },
}, { timestamps: true })

const settingsModel = mongoose.model("settings_collection", settingsSchema)
export default settingsModel
