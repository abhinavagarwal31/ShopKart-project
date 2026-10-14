import razorpay from "../config/razorpay.js"
import Order from "../models/order.model.js"
import Product from "../models/product.model.js"

export const createOrder = async (req, res)=>{
    try {
        const {shippingAddress} = req.body
    
        if (!shippingAddress) {
            return res.status(400).json({
                message: "Shipping address is required."
            })
        }
    
        const { fullName, phone, addressLine1, city, state, pincode } = shippingAddress
        if (
            !fullName?.trim() ||
            !phone?.trim() ||
            !addressLine1?.trim() ||
            !city?.trim() ||
            !state?.trim() ||
            !pincode?.trim()
        ) {
            return res.status(400).json({
                message: "All shipping address fields are required."
            })
        }
    
        const customer = req.customer
        const customerId = customer._id
        const cart = customer.cart
    
        if(cart.length === 0){
            return res.status(400).json({message: "Nothing in Cart."})
        }
    
        const order = {}
        order.customer = customerId
        order.items = []
    
        for (const item of cart) {
            const product = await Product.findById(item.product)
            if (!product) {
                return res.status(404).json({
                    message: "Product Not Found"
                })
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: "Product Not In Stock"
                })
            }
            order.items.push({
                product: item.product,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                image: product.image
            })
        }
    
        order.shippingAddress = shippingAddress
        order.totalAmount = order.items.reduce((total, item)=> total + item.price*item.quantity, 0)
    
        const createdOrder = await Order.create(order)
    
        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(createdOrder.totalAmount * 100),
            currency: "INR",
            receipt: createdOrder._id.toString()
        })
    
        createdOrder.razorpayOrderId = razorpayOrder.id
        await createdOrder.save()
    
        res.status(201).json({success: true, shopKartOrderId: createdOrder._id, razorpayOrderId: createdOrder.razorpayOrderId, amount: razorpayOrder.amount, currency: razorpayOrder.currency, key: process.env.RAZORPAY_KEY_ID})
    } catch (error) {
        return res.status(500).json({message: "Internal Server Error", error: error})
    }
}