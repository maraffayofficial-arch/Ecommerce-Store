import settingsModel from "../model/settings.js"

const getOrCreate = async () => {
    let s = await settingsModel.findOne()
    if (!s) s = await settingsModel.create({})
    return s
}

export const getShippingSettings = async (req, res) => {
    try {
        const settings = await getOrCreate()
        res.json(settings)
    } catch (error) {
        res.status(500).json({ message: "Error fetching settings", error })
    }
}

export const updateShippingSettings = async (req, res) => {
    try {
        const { shippingFee, freeShipping, globalSale, saleBanner } = req.body
        const settings = await getOrCreate()
        if (shippingFee !== undefined) settings.shippingFee = Number(shippingFee)
        if (freeShipping !== undefined) settings.freeShipping = Boolean(freeShipping)
        if (globalSale !== undefined) settings.globalSale = Number(globalSale)
        if (saleBanner !== undefined) { settings.saleBanner = saleBanner; settings.markModified('saleBanner') }
        await settings.save()
        res.json({ success: true, settings })
    } catch (error) {
        res.status(500).json({ message: "Error updating settings", error })
    }
}

export const uploadBannerImage = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No image uploaded" })
        const imageUrl = req.file.path
        const settings = await getOrCreate()
        settings.saleBanner = { ...(settings.saleBanner?.toObject ? settings.saleBanner.toObject() : settings.saleBanner), imageUrl }
        settings.markModified('saleBanner')
        await settings.save()
        res.json({ success: true, imageUrl })
    } catch (error) {
        res.status(500).json({ message: "Error uploading banner image", error })
    }
}

export const getSpecialMenu = async (req, res) => {
    try {
        const settings = await getOrCreate()
        await settings.populate('specialMenu')
        res.json(settings.specialMenu)
    } catch (error) {
        res.status(500).json({ message: "Error fetching special menu", error })
    }
}

export const updateSpecialMenu = async (req, res) => {
    try {
        const { productIds } = req.body
        if (!Array.isArray(productIds) || productIds.length > 6) {
            return res.status(400).json({ message: "Provide up to 6 product IDs" })
        }
        const settings = await getOrCreate()
        settings.specialMenu = productIds
        await settings.save()
        res.json({ success: true })
    } catch (error) {
        res.status(500).json({ message: "Error updating special menu", error })
    }
}
