import express from 'express'
import { getCustomer, loginCustomer, registerCustomer } from '../controllers/customer.controller.js'
import { isAuthenticated } from '../middlewares/auth.middleware.js'


const customerRouter = express.Router()


customerRouter.post('/register', registerCustomer)
customerRouter.post('/login', loginCustomer)
customerRouter.get('/me', isAuthenticated, getCustomer)


export default customerRouter