import Customer from "../models/customer.model.js"
import bcrypt from 'bcrypt'
import { genToken } from "../utils/generateToken.js"

const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/"
}

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
        console.log(`Customer Registered with the name ${newCustomer.fullName}`)
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error })
    }

}


export const loginCustomer = async(req, res) =>{
    try {
        const {email, password} = req.body

        const customer = await Customer.findOne({email})
        if(!customer){
            return res.status(401).json({message: "Invalid Credentials"})
        }
        const passChk = await bcrypt.compare(password, customer.password)
        if(!passChk){
            return res.status(401).json({message: "Invalid Credentials"})
        }

        const token = genToken(customer._id)
        res.cookie("token", token, cookieOptions)
        res.status(200).json({
            success: true,
            message: "Login successful"
        })


    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error })
    }
}

export const getCustomer = (req, res) =>{
    res.status(200).json({
        _id: req.customer._id,
        fullName: req.customer.fullName,
        email: req.customer.email,
        phone: req.customer.phone
    })
}

export const logoutCustomer = ((req, res)=>{
    res.clearCookie("token")

    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    })
})

export const changePassword = async (req, res)=>{
    const {oldP, newP} = req.body
    const passChk = await bcrypt.compare(oldP.toString(), req.customer.password)
    if(!passChk){
        return res.status(401).json({message: "Invalid Credentials"})
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(newP.toString(), salt)
    const updated = await Customer.findByIdAndUpdate(req.customer._id, {password: hashedPass})
    
    res.status(200).json(updated)
}