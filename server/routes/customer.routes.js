import express from 'express'
import { registerCustomer } from '../controllers/customer.controller.js'


const customerRouter = express.Router()


customerRouter.post('/register', registerCustomer)



export default customerRouter