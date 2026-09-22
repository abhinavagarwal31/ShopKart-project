import express from 'express'
import { createProduct, getAllProducts, getProduct } from '../controllers/products.controller.js'


const productRouter = express.Router()

productRouter.post('/products', createProduct)
productRouter.get('/products', getAllProducts)
productRouter.get('/products/:id', getProduct)

export default productRouter