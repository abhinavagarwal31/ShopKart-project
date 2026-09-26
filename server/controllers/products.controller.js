import mongoose from "mongoose"
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
    
    const {search, category} = req.query
    const filter = {}
    if(search){
        filter.name = {$regex: search, $options: "i"}
    }
    if(category){
        filter.category = category
    }

    const products = await Product.find(filter).select("-description -createdAt -updatedAt -__v")
    res.status(200).json({
        success: true,
        count: products.length,
        products: products
    })
}

export const getProduct = async (req, res)=>{
    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({message: "Invalid Product ID"})
    }
    const product = await Product.findById(id).select("-createdAt -updatedAt -__v")
    if(!product){
        return res.status(404).json({
            message: "Product Not Found"
        })
    }
    res.status(200).json(product)
}