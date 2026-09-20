import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import customerRouter from './routes/customer.routes.js'
import cors from 'cors'

const app = express()
const PORT = 9000
dotenv.config()
mongoose.connect(process.env.dburl).then(()=>{
    console.log("DB Connected")
}).catch((err) => {
    console.log(err)
})
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use('/customers', customerRouter)









app.listen(PORT, ()=>{
    console.log(`Server Started at Port: ${PORT}`)
})