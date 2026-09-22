import express from 'express'
import { createProduct, getAllProducts } from '../controllers/products.controller.js'


const productRouter = express.Router()

productRouter.post('/products', createProduct)
productRouter.get('/products', getAllProducts)

export default productRouter