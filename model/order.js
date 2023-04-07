let mongoose = require('mongoose');
let userSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Must Provide User Id'], 
  },
  name: { 
    type: String, 
    required: [true, 'Must Provide name'] 
  },
  email: { 
    type: String, 
    required: [true, 'Must Provide email Id'] 
  },
  contactNo: { 
    type: String, 
    required: [true, 'Must Provide Contact No'] 
  }
});
let addressSchema = new mongoose.Schema({
  residenceNo:{
    type:String,
    required:[true,"Must Provide residence No"]
  },
  residenceName:{
    type:String,
    required:[true,"Must Provide residence Name"]
  },
  street:{
    type:String,
    required:[true,"Must Provide street"]
  },
  area:{
    type:String,
    required:[true,"Must Provide area"]
  },
  city:{
    type:String,
    required:[true,"Must Provide city"]
  },
  state:{
    type:String,
    required:[true,"Must Provide state"]
  },
  country:{
    type:String,
    required:[true,"Must Provide country"]
  },
})
let productSchema = new mongoose.Schema({
  sellerId: {
    type: String
  },
  name: {
    type: String,
    required: [true, 'must provide product name']
  },
  image: {
    type: String,
    require: true
  },
  brand: {
    type: String,
    require: true
  },
  productDetails: {
    type: Object
  },
  category: {
    type: String,
    required: [true, 'must provide category of product'],
    trim: true
  },
});
const variantSchema = new mongoose.Schema({
  variantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  images: {
    type: [String]
  },
  price: {
    type: Number,
    required: true
  },
  size: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [0, 'not available this quantity which you entered']
  }
});
let orderSchema = new mongoose.Schema({
  _Id: {
    type: String
  },
  user: {
    type: userSchema,
    required: [true, 'Must Provide user']
  },
  products: {
    type: [productSchema],
    required: [true, 'Must Provide List of Products']
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Must Provide Payment Id']
  },
  billingAddress: {
    type: addressSchema,
    required: [true, 'Must Provide Billing Address']
  },
  shippingAddress: {
    type: addressSchema,
    required: [true, 'Must provide shipping address']
  },
  status: {
    type: String,
    required: [true, 'Must Provide Order Status']
  },
  orderDate: {
    type: Date,
    require: [true, 'Must Provide Order Date']
  },
  deliveryDate: {
    type: Date,
    require: [true, 'Must Provide deliveryDate']
  },
  totalAmount: {
    type: Number,
    required: [true, 'Must Provide totalAmount']
  },
  shippingCharge: {
    type: Number,
    required: [true, 'Must Provide shipping charge']
  },
  variant:{
    type:[variantSchema],
    required: [true, "Must provide variant"]
  }
});

module.exports = mongoose.model('Order', orderSchema);
