import express from 'express'
import { createProduct } from '../controllers/products.controller.js'


const productRouter = express.Router()

productRouter.post('/products', createProduct)

export default productRouter