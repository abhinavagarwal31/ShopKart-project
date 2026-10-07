import express from "express"
import { isAuthenticated } from "../middlewares/auth.middleware.js"
import { addWish, deleteWish, getWish } from "../controllers/wishlist.controller.js"

const wishRouter = express.Router()

wishRouter.post('/:productId', isAuthenticated, addWish)
wishRouter.get('/', isAuthenticated, getWish)
wishRouter.delete('/:productId', isAuthenticated, deleteWish)

export default wishRouter
