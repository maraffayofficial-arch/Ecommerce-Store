import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    },
})

export const sendOtpEmail = async (toEmail, otp) => {
    await transporter.sendMail({
        from: `"Urban Pickle" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: "Your Password Reset OTP",
        html: `
            <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
                <h2 style="color:#15803d;margin-bottom:8px;">Urban Pickle</h2>
                <p style="color:#374151;font-size:16px;">Use the OTP below to reset your password. It expires in <strong>10 minutes</strong>.</p>
                <div style="font-size:36px;font-weight:bold;letter-spacing:10px;color:#ea580c;text-align:center;padding:24px 0;">
                    ${otp}
                </div>
                <p style="color:#6b7280;font-size:13px;">If you did not request this, you can safely ignore this email.</p>
            </div>
        `,
    })
}
