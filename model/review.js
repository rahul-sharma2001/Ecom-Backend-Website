const mongoose = require('mongoose')
const reviewSchema=new mongoose.Schema({
    productId:{
        type:String,
        required:[true,"must provide productId"],
        trim:true
    },
    comment:{
        type:String,
        trim:true
    },
    rating:{
        type:String,
        required:[true,"must provide rating"],
        trim:true,
    },
    customerName:{
        type:String,
        required:[true,"must provide username"],
        trim:true,
    },
    date:{
        type:Date,
        default: Date.now()
    }
})

module.exports=mongoose.model('review',reviewSchema)