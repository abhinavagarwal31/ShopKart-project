import Customer from "../models/customer.model.js"
import bcrypt from 'bcrypt'

export const  registerCustomer = async (req, res) => {
    try {
        const {fullName, email, password, phone} = req.body
    
        if(!fullName || !email || !password || !phone){
            return res.status(400).json({message: "Some of the Fields are missing."})
        }
    
        const emailExists = await Customer.findOne({email})
        if(emailExists){
            return res.status(409).json({message: "Account already exists."})
        }
    
        if(password.length < 6){
            return res.status(400).json({message: "Password too short (Must be atleast 6 characters)"})
        }
    
        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(password, salt)
    
        const newCustomer = await Customer.create({
            fullName,
            email,
            password: hashedPass,
            phone
        })
        res.status(201).json({
            success: true,
            message: "Customer registered successfully",
            customer: {
                _id: newCustomer._id,
                fullName: newCustomer.fullName,
                email: newCustomer.email,
                phone: newCustomer.phone
            }
        })
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error })
    }
}