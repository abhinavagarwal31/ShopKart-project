import mongoose from "mongoose"
import Customer from "../models/customer.model.js"
import Product from "../models/product.model.js"

export const addWish = async (req, res)=>{
    try {
        const userId = req.customer._id
        const {productId} = req.params
    
        if(!userId){
            return res.status(401).json({message: "User Not Authenticated"})
        }
        if(!mongoose.isValidObjectId(productId)){
            return res.status(400).json({message: "Invalid Product ID"})
        }
        if(!(await Product.findById(productId))){
            return res.status(404).json({message: "Product Not Found"})
        }
    
        const updated = await Customer.findOneAndUpdate({_id: userId, wishlist: {$ne: productId}}, {$addToSet: {wishlist: productId}})
    
        if(!updated){
            return res.status(409).json({message: "Already in Wishlist"})
        }
        
        res.status(200).json({success: true, message: "Product added to wishlist"})
    } catch (error) {
        return res.status(500).json({message: "Internal Server Error", error: error})
    }
}