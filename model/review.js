const mongoose = require('mongoose')
const moment = require('moment');

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
        type:String,
        default: moment().format('MMMM Do, YYYY')
    }
})

module.exports=mongoose.model('review',reviewSchema)