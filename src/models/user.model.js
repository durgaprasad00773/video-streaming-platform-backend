import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true, 
        lowercase : true, 
        unique : true,
        index : true,
        trim : true
    },
    email : {
        type : String,
        required : true, 
        lowercase : true, 
        unique : true,
        trim : true
    },
    fullName : {
        type : String,
        required : true,
        trim : true
    },
    avatar : {
        type : String,  //cloudinary url
        required : true
    },
    coverImage : {
        type : String
    },
    watchHistory : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Video"
    }],
    password : {
        type : String, 
        required : [true, "Password is required"]
    },
    refreshToken : {
        type : String
    }
},{
    timestamps : true
})


// userSchema.pre("save", async function(next) {
//     if(!this.isModified("password"))
//     {
//         return next()
//     }

//     this.password = await bcrypt.hash(this.password, 10)
//     next()
// })

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return

    this.password = await bcrypt.hash(this.password, 10)
})


userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    //payload
    return jwt.sign({
        _id : this._id,
        email : this.email,
        name : this.name,
        fullName : this.fullName
        },

        //secret
        process.env.ACCESS_TOKEN_SECRET, 
        
        //options
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY 

        })
    }
userSchema.methods.generateRefreshToken = function (){

    //payload
    return jwt.sign({
        _id : this._id,
        email : this.email,
        name : this.name,
        fullName : this.fullName
        },


        //secret
        process.env.REFRESH_TOKEN_SECRET, 
        
        //options
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY 

        }
)}


export const User = mongoose.model("User", userSchema)