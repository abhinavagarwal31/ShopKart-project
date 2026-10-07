import express from "express"
import { isAuthenticated } from "../middlewares/auth.middleware.js"
import { addWish } from "../controllers/wishlist.controller.js"

const wishRouter = express.Router()

wishRouter.post('/:productId', isAuthenticated, addWish)

export default wishRouter
