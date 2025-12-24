// require("dotenv").config({path : "./env"})
import dotenv from "dotenv"
dotenv.config()
import mongoose from "mongoose";
import {DB_NAME} from "./constants.js"
import connectDB from "./db/db.js"
import express from "express";
import { app } from "./app.js";


connectDB()
.then(() => {
    app.listen(process.env.PORT, ()=> {
        console.log("Server is started at port : ", process.env.PORT);
    })
})
.catch((err) => {
    console.log("Error in DataBase connection : ", err);
})



