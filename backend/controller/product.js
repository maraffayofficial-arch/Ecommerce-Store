import productModel from "../model/product.js"
import { cloudinary } from "../utils/cloudinary.js"

const getProducts = async (req, res) => {
    try {
        const products = await productModel.find().sort({ _id: -1 })
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({ message: "Error getting products", error })
    }
}

const getProductById = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id)
        if (!product) return res.status(404).json({ message: "Product not found" })
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json({ message: "Error getting product", error })
    }
}

const createProduct = async (req, res) => {
    try {
        const { title, discription, price, category, weight } = req.body
        const images = req.files?.map(f => f.path) || []
        if (images.length === 0) return res.status(400).json({ message: "At least one image is required" })
        const product = new productModel({ title, discription, price, category, weight, images })
        await product.save()
        res.status(201).json({ success: true, message: "Product created", product })
    } catch (error) {
        res.status(500).json({ message: "Error creating product", error })
    }
}

const updateProduct = async (req, res) => {
    try {
        const existing = await productModel.findById(req.params.id)
        if (!existing) return res.status(404).json({ message: "Product not found" })

        const { title, discription, price, category, weight } = req.body
        const newImages = req.files?.map(f => f.path) || []

        // If new images uploaded, delete old ones from Cloudinary
        if (newImages.length > 0) {
            for (const url of existing.images) {
                const publicId = url.split("/").slice(-2).join("/").replace(/\.[^.]+$/, "")
                await cloudinary.uploader.destroy(publicId).catch(() => {})
            }
        }

        const images = newImages.length > 0 ? newImages : existing.images

        const product = await productModel.findByIdAndUpdate(
            req.params.id,
            { title, discription, price, category, weight, images },
            { new: true }
        )
        res.status(200).json({ success: true, message: "Product updated", product })
    } catch (error) {
        res.status(500).json({ message: "Error updating product", error })
    }
}

const deleteProduct = async (req, res) => {
    try {
        const product = await productModel.findByIdAndDelete(req.params.id)
        if (!product) return res.status(404).json({ message: "Product not found" })
        // Delete images from Cloudinary
        for (const url of product.images) {
            const publicId = url.split("/").slice(-2).join("/").replace(/\.[^.]+$/, "")
            await cloudinary.uploader.destroy(publicId).catch(() => {})
        }
        res.status(200).json({ success: true, message: "Product deleted" })
    } catch (error) {
        res.status(500).json({ message: "Error deleting product", error })
    }
}

export { getProducts, getProductById, createProduct, updateProduct, deleteProduct }
