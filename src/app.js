import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import {errorHandler }from "./middleware/error.middleware.js";

const app = express()
app.use(express.json())


app.use(cors({
    origin : process.env.CORS_ORIGIN,
    
}))
app.use(cookieParser())
app.use(express.json({limit:"16Kb"}));
app.use(express.urlencoded({extended : true, limit : "16Kb"}))

//impotring routes

import userRouter from "./routes/user.router.js"


app.use("/api/v1/users", userRouter)

//last line

app.use(errorHandler)
export {app}