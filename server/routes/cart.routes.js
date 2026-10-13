import express from 'express'
import { isAuthenticated } from '../middlewares/auth.middleware.js'
import { addProduct } from '../controllers/cart.controller.js'

const cartRouter = express.Router()

cartRouter.post('/:productId', isAuthenticated, addProduct)


export default cartRouter