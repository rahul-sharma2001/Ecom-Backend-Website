let mongoose = require('mongoose');
let userSchema = new mongoose.Schema({

  userId: {
    type: String,
    required: [true, 'Must Provide User Id']
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

let productSchema = new mongoose.Schema({
  productId: { 
    type: String, 
    required: [true, 'Must Provide Product Id'] 
  },
  sellerId: { 
    type: String, 
    required: [true, 'Must Provide Seller Id']
  },
  price: { 
    type: Number, 
    required: [true, 'Must Provide price'] 
  },
  quantity: { 
    type: Number, 
    required: [true, 'Must Provide quantity'] 
  },
  category: {
    type:String,
  },
  name: {
    type:String,
  },
  ProductDetails: {
    type:Object
  },
  images: {
    type:[String]
  },
  variant: {
    type:String,
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
    type: String, 
    required: [true, 'Must Provide Payment Id'] 
  },
  billingAddress: {
    type: Object,
    required: [true, 'Must Provide Billing Address']
  },
  shippingAddress: {
    type: Object,
    required: [true, 'Must provide shipping address']
  },
  status: { 
    type: String, 
    required: [true, 'Must Provide Order Status'] 
  }, 
  orderDate: {
    type:String,
    format:"date",
    require: [true,"Must Provide Order Date"]
  },
  deliveryDate: {
    type:String,
    format:"date",
    require: [true, "Must Provide deliveryDate"]
  },
  totalAmount: { 
    type: Number, 
    required: [true, 'Must Provide totalAmount'] 
  },
  shippingCharge: {
    type: Number,
    required: [true, 'Must Provide shipping charge']
  }
});

module.exports = mongoose.model('Order', orderSchema);
