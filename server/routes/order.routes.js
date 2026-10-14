import express from 'express'
import { isAuthenticated } from '../middlewares/auth.middleware.js'
import { createOrder } from '../controllers/order.controller.js'

const orderRouter = express.Router()

orderRouter.post("/create-payment-order", isAuthenticated, createOrder)

export default orderRouter