import mongoose from "mongoose"
import Product from "../models/product.model.js"
import Customer from "../models/customer.model.js"

export const addProduct = async(req, res)=>{
    try {
        const {productId} = req.params
        const customerId = req.customer._id
    
        if(!mongoose.isValidObjectId(productId)){
            return res.status(400).json({message: "Invalid Product ID"})
        }
    
        const product = await Product.findById(productId)
        if(!product){
            return res.status(404).json({message: "Product Not Found"})
        }
    
        const customer = await Customer.findById(customerId)
        const item = customer.cart.find((item)=> item.product.toString() === productId.toString())
        
        if(item){
            if(item.quantity+1 > product.stock){
                return res.status(400).json({message: `Only ${product.stock} in stock.`})
            }
            item.quantity+=1
        }else {
            if(product.stock < 1){
                return res.status(400).json({message: `Not in stock.`})
            }
            customer.cart.push({product: productId, quantity: 1})
        }
        await customer.save()
        res.status(200).json({success: true, message: "Cart updated", cart: customer.cart})
    } catch (error) {
        return res.status(500).json({message: "Internal Server Error", error: error})
    }
}

export const getCart = async(req, res)=>{
    try {
        const customerId = req.customer._id
        
        const customer = await Customer.findById(customerId).populate("cart.product", "_id name price image stock")
    
        res.status(200).json({success: true, cart: customer.cart})
    } catch (error) {
        return res.status(500).json({message: "Internal Server Error", error: error})
    }
}

export const updateCart = async(req, res)=>{
    try {
        const customerId = req.customer._id
    
        const {productId} = req.params
        if(!mongoose.isValidObjectId(productId)){
            return res.status(400).json({message: "Invalid Product ID"})
        }
    
        const product = await Product.findById(productId)
        if(!product){
            return res.status(404).json({message: "Product Not Found"})
        }
    
        const {quantity} = req.body
        if(!Number.isInteger(quantity) || quantity < 1){
            return res.status(400).json({message: "Invalid quantity"})
        }
        if(quantity > product.stock){
            return res.status(400).json({message: "Required quantity Not Available"})
        }
    
        const customer = await Customer.findById(customerId)
        const cart = customer.cart

    
        const target = cart.find((item)=> item.product.toString() === productId.toString())
        if(!target){
            return res.status(404).json({message: "Product Not in Cart"})
        }

        target.quantity = quantity
        await customer.save()
        res.status(200).json({success: true, message: "Cart updated"})
    } catch (error) {
        return res.status(500).json({message: "Internal Server Error", error: error})
    }
}