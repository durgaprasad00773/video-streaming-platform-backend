import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express()

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    
}))
app.use(cookieParser())
app.use(express.json({limit:"16Kb"}));
app.use(express.urlencoded({extended : true, limit : "16Kb"}))


export {app}