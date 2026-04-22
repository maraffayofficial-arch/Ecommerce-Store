import subscriberModel from "../model/subscriber.js"
import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
})

export const subscribe = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) return res.status(400).json({ success: false, message: "Email is required." })

        const existing = await subscriberModel.findOne({ email })
        if (existing) return res.status(409).json({ success: false, message: "You are already subscribed!" })

        await subscriberModel.create({ email })

        await transporter.sendMail({
            from: `"Urban Pickle" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Welcome to Urban Pickle Newsletter! 🥒",
            html: `
                <div style="font-family:sans-serif;max-width:520px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
                    <h2 style="color:#15803d;margin-bottom:4px;">Urban <span style="color:#ea580c;">Pickle</span></h2>
                    <hr style="border:none;border-top:1px solid #e5e7eb;margin:12px 0;" />
                    <h3 style="color:#111827;margin-bottom:8px;">Thank you for subscribing! 🎉</h3>
                    <p style="color:#374151;font-size:15px;line-height:1.6;">
                        You're now part of the Urban Pickle family. You'll be the <strong>first to know</strong> about:
                    </p>
                    <ul style="color:#374151;font-size:15px;line-height:2;">
                        <li>🛍️ Exclusive sales and seasonal promotions</li>
                        <li>🆕 New product launches</li>
                        <li>🌶️ Special Eid, Ramadan & festival deals</li>
                    </ul>
                    <p style="color:#374151;font-size:15px;margin-top:16px;">
                        All future deals and promotions will land directly in your inbox — so keep an eye out!
                    </p>
                    <div style="margin-top:24px;padding:16px;background:#f0fdf4;border-radius:8px;text-align:center;">
                        <p style="color:#15803d;font-weight:bold;font-size:16px;margin:0;">Happy Pickling! 🥒</p>
                        <p style="color:#6b7280;font-size:13px;margin:4px 0 0;">— The Urban Pickle Team</p>
                    </div>
                    <p style="color:#9ca3af;font-size:11px;margin-top:20px;text-align:center;">
                        Multan, Pakistan &nbsp;|&nbsp; urbanpickle@gmail.com
                    </p>
                </div>
            `,
        })

        return res.status(201).json({ success: true, message: "Subscribed successfully! Check your email." })
    } catch (error) {
        res.status(500).json({ success: false, message: "Subscription failed.", error })
    }
}
