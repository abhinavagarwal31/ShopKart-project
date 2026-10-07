import express from 'express'
import { createProduct, getAllProducts, getProduct } from '../controllers/products.controller.js'


const productRouter = express.Router()

productRouter.post('/', createProduct)
productRouter.get('/', getAllProducts)
productRouter.get('/:id', getProduct)

export default productRouter