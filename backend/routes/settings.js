import express from "express"
import { getShippingSettings, updateShippingSettings } from "../controller/settings.js"
import { verifyAdmin } from "../middleware/auth.js"

const router = express.Router()

router.get("/shipping", getShippingSettings)
router.put("/shipping", verifyAdmin, updateShippingSettings)

export default router
