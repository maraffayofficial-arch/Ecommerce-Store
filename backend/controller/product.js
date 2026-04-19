import productModel from "../model/product.js"

const getProducts = async (req, res) => {
    try {
        const products = await productModel.find()
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
        const { title, discription, price, category, weight, image } = req.body
        const product = new productModel({ title, discription, price, category, weight, image })
        await product.save()
        res.status(201).json({ success: true, message: "Product created", product })
    } catch (error) {
        res.status(500).json({ message: "Error creating product", error })
    }
}

const updateProduct = async (req, res) => {
    try {
        const product = await productModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!product) return res.status(404).json({ message: "Product not found" })
        res.status(200).json({ success: true, message: "Product updated", product })
    } catch (error) {
        res.status(500).json({ message: "Error updating product", error })
    }
}

const deleteProduct = async (req, res) => {
    try {
        const product = await productModel.findByIdAndDelete(req.params.id)
        if (!product) return res.status(404).json({ message: "Product not found" })
        res.status(200).json({ success: true, message: "Product deleted" })
    } catch (error) {
        res.status(500).json({ message: "Error deleting product", error })
    }
}

export { getProducts, getProductById, createProduct, updateProduct, deleteProduct }
