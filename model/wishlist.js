const mongoose = require('mongoose');

const wishlistVariant = new mongoose.Schema({
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
  }
});
const wishlistProduct = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product'
  },
  category: {
    type: String,
    trim: true
  },
  brand: {
    type: String,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  selectedVarient: {
    type: [wishlistVariant]
  }
});
const Wishlist = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    unique: true
  },
  products: {
    type: [wishlistProduct],
    required: true,
    validate: [val => val.length > 0, 'at least select one product']
  }
});
module.exports = mongoose.model('Wishlist', Wishlist);
