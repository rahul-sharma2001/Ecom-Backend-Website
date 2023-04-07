const mongoose = require('mongoose');

const cartVariant = new mongoose.Schema({
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

const cartProduct = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product'
  },
  category: {
    type: String,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  productDetails: {
    type: Object
  },
  image: {
    type: String
  },
  selectedVariants: {
    type: [cartVariant],
    validate: [val => val.length > 0, 'at least select one variant']
  }
});

// --> why reference not working in userId--------------------------problem------------
const Cart = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    unique: true
  },
  products: {
    type: [cartProduct],
    required: true,
    validate: [val => val.length > 0, 'at least select one product']
  }
});

module.exports = mongoose.model('Cart', Cart);
