import jwt from 'jsonwebtoken'
import Customer from '../models/customer.model.js'


export const isAuthenticated = async(req, res, next) => {
    const token = req.cookies.token

    if(!token){
        return res.status(401).json({message:"Not Authorized"})
    }

    const decoded = jwt.verify(token, process.env.jwt_secret)

    const customer = await Customer.findById(decoded.id)

    if(!customer){
        return res.status(404).json({message: "Customer Not Found"}) 
    }

    req.customer = customer

    next()

}