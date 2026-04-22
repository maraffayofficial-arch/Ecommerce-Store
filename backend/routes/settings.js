import express from "express"
import { getShippingSettings, updateShippingSettings, getSpecialMenu, updateSpecialMenu, uploadBannerImage } from "../controller/settings.js"
import { verifyAdmin } from "../middleware/auth.js"
import { uploadBanner } from "../utils/cloudinary.js"

const router = express.Router()

router.get("/shipping", getShippingSettings)
router.put("/shipping", verifyAdmin, updateShippingSettings)
router.get("/special-menu", getSpecialMenu)
router.put("/special-menu", verifyAdmin, updateSpecialMenu)
router.post("/banner-image", verifyAdmin, uploadBanner.single("image"), uploadBannerImage)

export default router
