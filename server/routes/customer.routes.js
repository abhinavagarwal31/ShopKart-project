import express from 'express'
import { changePassword, getCustomer, loginCustomer, logoutCustomer, registerCustomer } from '../controllers/customer.controller.js'
import { isAuthenticated } from '../middlewares/auth.middleware.js'


const customerRouter = express.Router()


customerRouter.post('/register', registerCustomer)
customerRouter.post('/login', loginCustomer)
customerRouter.get('/me', isAuthenticated, getCustomer)
customerRouter.post('/logout', logoutCustomer)
customerRouter.patch('/change-password', isAuthenticated, changePassword)


export default customerRouter