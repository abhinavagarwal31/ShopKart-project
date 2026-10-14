import express from 'express'
import 'dotenv/config'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import customerRouter from './routes/customer.routes.js'
import productRouter from './routes/product.routes.js'
import cors from 'cors'
import wishRouter from './routes/wishlist.routes.js'
import cartRouter from './routes/cart.routes.js'
import orderRouter from './routes/order.routes.js'

const app = express()
const PORT = process.env.PORT || 9000

mongoose.connect(process.env.dburl).then(()=>{
    console.log("DB Connected")
}).catch((err) => {
    console.log(err)
})

app.use(express.json())
app.use(cookieParser())

const allowedOrigins = [
    'http://localhost:5173',
    process.env.CLIENT_URL
].filter(Boolean)

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))

app.use('/customers', customerRouter)
app.use('/products', productRouter)
app.use('/wishlist', wishRouter)
app.use('/cart', cartRouter)
app.use('/orders', orderRouter)








app.listen(PORT, ()=>{
    console.log(`Server Started at Port: ${PORT}`)
})