import express from 'express'
import dotenv from 'dotenv'

const app = express()
const PORT = 8089
dotenv.config()
mongoose.connect(process.env.dburl)









app.listen(PORT, ()=>{
    console.log(`Server Started at Port: ${PORT}`)
})