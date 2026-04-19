import express from "express"
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from "../controller/product.js"
import { verifyAdmin } from "../middleware/auth.js"
import { upload } from "../utils/cloudinary.js"

const router = express.Router()

router.get("/", getProducts)
router.get("/:id", getProductById)
router.post("/", verifyAdmin, upload.array("images", 4), createProduct)
router.put("/:id", verifyAdmin, upload.array("images", 4), updateProduct)
router.delete("/:id", verifyAdmin, deleteProduct)

export default router
