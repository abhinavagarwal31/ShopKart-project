import express from 'express'
import { isAuthenticated } from '../middlewares/auth.middleware.js'
import { addProduct, getCart, removeProduct, updateCart } from '../controllers/cart.controller.js'

const cartRouter = express.Router()

cartRouter.post('/:productId', isAuthenticated, addProduct)
cartRouter.get('/', isAuthenticated, getCart)
cartRouter.patch('/:productId', isAuthenticated, updateCart)
cartRouter.delete('/:productId', isAuthenticated, removeProduct)

export default cartRouter