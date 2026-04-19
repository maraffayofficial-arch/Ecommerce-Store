import express from "express"
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from "../controller/product.js"
import { verifyAdmin } from "../middleware/auth.js"

const router = express.Router()

router.get("/", getProducts)
router.get("/:id", getProductById)
router.post("/", verifyAdmin, createProduct)
router.put("/:id", verifyAdmin, updateProduct)
router.delete("/:id", verifyAdmin, deleteProduct)

export default router
