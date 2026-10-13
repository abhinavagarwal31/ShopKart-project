import express from 'express'
import { isAuthenticated } from '../middlewares/auth.middleware.js'
import { addProduct, getCart, updateCart } from '../controllers/cart.controller.js'

const cartRouter = express.Router()

cartRouter.post('/:productId', isAuthenticated, addProduct)
cartRouter.get('/', isAuthenticated, getCart)
cartRouter.patch('/:productId', isAuthenticated, updateCart)


export default cartRouter