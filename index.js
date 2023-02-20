import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import router from "./routes/userRoute.js";

dotenv.config()
const app = express()

app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(router)

app.listen(5000, ()=>{
    console.log('Server berjalan pada port 5000...')
})