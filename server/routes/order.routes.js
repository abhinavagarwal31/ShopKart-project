import express from 'express'
import { isAuthenticated } from '../middlewares/auth.middleware.js'
import { createOrder, getOrders, verifyPayment } from '../controllers/order.controller.js'

const orderRouter = express.Router()

orderRouter.post("/create-payment-order", isAuthenticated, createOrder)
orderRouter.post("/verify-payment", isAuthenticated, verifyPayment)
orderRouter.get("/", isAuthenticated, getOrders)

export default orderRouter