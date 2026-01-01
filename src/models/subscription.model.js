import mongoose from "mongoose"

const subscription = new mongoose.Schema({
    channel : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    subscriber : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
}, {timestamps : true})

const Subscription = mongoose.model("Subscription", subscription);