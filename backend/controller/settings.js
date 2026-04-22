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
        const { shippingFee, freeShipping } = req.body
        const settings = await getOrCreate()
        if (shippingFee !== undefined) settings.shippingFee = Number(shippingFee)
        if (freeShipping !== undefined) settings.freeShipping = Boolean(freeShipping)
        await settings.save()
        res.json({ success: true, settings })
    } catch (error) {
        res.status(500).json({ message: "Error updating settings", error })
    }
}
