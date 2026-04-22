import settingsModel from "../model/settings.js"
import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: { user: process.env.BREVO_USER, pass: process.env.BREVO_PASS },
})

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
        if (req.body.contactInfo !== undefined) { settings.contactInfo = req.body.contactInfo; settings.markModified('contactInfo') }
        if (req.body.paymentDetails !== undefined) { settings.paymentDetails = req.body.paymentDetails; settings.markModified('paymentDetails') }
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

export const sendContactEmail = async (req, res) => {
    try {
        const { name, email, message } = req.body
        if (!name || !email || !message)
            return res.status(400).json({ success: false, message: "All fields are required." })

        const settings = await getOrCreate()
        const adminEmail = settings.contactInfo?.email || process.env.EMAIL_USER

        await transporter.sendMail({
            from: `"Urban Pickle Contact" <${process.env.BREVO_USER}>`,
            to: adminEmail,
            replyTo: email,
            subject: `New Message from ${name} — Urban Pickle`,
            html: `
                <div style="font-family:sans-serif;max-width:520px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
                    <h2 style="color:#15803d;">Urban <span style="color:#ea580c;">Pickle</span> — Contact Form</h2>
                    <hr style="border:none;border-top:1px solid #e5e7eb;margin:12px 0;" />
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                    <p><strong>Message:</strong></p>
                    <div style="background:#f9fafb;padding:16px;border-radius:8px;color:#374151;white-space:pre-wrap;">${message}</div>
                    <p style="color:#9ca3af;font-size:12px;margin-top:20px;">Reply directly to this email to respond to the customer.</p>
                </div>
            `,
        })

        return res.status(200).json({ success: true, message: "Message sent successfully!" })
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to send message.", error })
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
