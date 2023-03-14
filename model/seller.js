const mongoose = require('mongoose');
const { isEmail, isStrongPassword } = require('validator');

const sellerAddressSchema = new mongoose.Schema({
  name: {
    type: String
  },
  contactNumber: {
    type: String,
    required: true
  },
  pincode: {
    type: Number,
    required: true
  },
  street: {
    type: String,
    required: true
  },
  locality: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  }
});

const sellerModel = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },

  address: {
    type: sellerAddressSchema,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    default: 0
  }
});
module.exports = mongoose.model('Seller', sellerModel);
