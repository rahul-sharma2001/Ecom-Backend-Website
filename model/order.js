let mongoose = require('mongoose');
let userSchema = new mongoose.Schema({
    // userId:mongoose.Schema.Types.ObjectId,
    userId:{type:String,required:[true,"Must Provide User Id"]},
    name:{type:String,required:[true,"Must Provide name"]},
    email:{type:String,required:[true,"Must Provide email Id"]},
    contactNo:{type:String,required:[true,"Must Provide Contact No"]},
})

let productSchema = new mongoose.Schema({
    productId:{type:String,required:[true,"Must Provide Product Id"]},
    sellerId:{type:String,required:[true,"Must Provide Seller Id"]},
    price: {type:Number,required:[true,"Must Provide price"]}, 
    quantity:{type:Number,required:[true,"Must Provide quantity"]},
    category:String,
    name: String,
    ProductDetails:Object,
    images : [String],
    variant: String



})
let orderSchema = new mongoose.Schema({
    // orderId:mongoose.Schema.Types.ObjectId
    // paymentId:mongoose.Schema.Types.ObjectId,
    _Id: {type:String},
    user:{type:userSchema,required:[true,"Must Provide user"]},
    products:{type:[productSchema],required:[true,"Must Provide List of Products"]},
    paymentId:{type:String,required:[true,"Must Provide Payment Id"]},
    billingAddress:{type:Object,required:[true,"Must Provide Billing Address"]},
    shippingAddress:{type:Object,required:[true,"Must provide shipping address"]},
    status:{type:String,required:[true,"Must Provide Order Status"]},
    orderDate:String,
    deliveryDate:String,
    totalAmount:{type:Number,required:[true,"Must Provide totalAmount"]},
    shippingCharge:{type:Number,required:[true,"Must Provide shipping charge"]},
})

module.exports = mongoose.model('Order',orderSchema);