import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import multer from "multer"
import dotenv from "dotenv"

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "urban-pickle/products",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [{ width: 800, height: 800, crop: "limit", quality: "auto" }],
    },
})

export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
})

const bannerStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "urban-pickle/banners",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [{ width: 1920, height: 1080, crop: "fill", quality: "auto" }],
    },
})

export const uploadBanner = multer({
    storage: bannerStorage,
    limits: { fileSize: 10 * 1024 * 1024 },
})

export { cloudinary }
