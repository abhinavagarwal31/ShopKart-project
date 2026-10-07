import express from "express"
import { isAuthenticated } from "../middlewares/auth.middleware.js"
import { addWish, getWish } from "../controllers/wishlist.controller.js"

const wishRouter = express.Router()

wishRouter.post('/:productId', isAuthenticated, addWish)
wishRouter.get('/', isAuthenticated, getWish)

export default wishRouter
