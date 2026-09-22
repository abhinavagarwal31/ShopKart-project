import Product from "../models/product.model.js"


export const createProduct = async (req, res)=>{
    const {name, description, price, category, image, stock} = req.body
    if(!name || !description || price === undefined || !category || !image || stock === undefined){
        return res.status(400).json({message: "All fileds are Required!"})
    }
    if(price <= 0){
        return res.status(400).json({message: "Price must be greater than 0."})
    }
    if(stock < 0){
        return res.status(400).json({message: "Stock cannot be less than 0."})
    }
    const newProduct = await Product.create(req.body)
    res.status(201).json(newProduct)
}

export const getAllProducts = async (req, res)=>{
    const products = await Product.find().select("-description -createdAt -updatedAt -__v")
    res.status(201).json({
        success: true,
        count: products.length,
        products: products
    })
}