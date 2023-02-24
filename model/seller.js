const mongoose = require('mongoose');
const { isEmail, isStrongPassword } = require('validator');

const sellerAddressSchema = new mongoose.Schema({
  addressType: {
    type: String,
    required: true,
    enum: ['home', 'work']
  },
  name: {
    type: String
  },
  contactNumber: {
    type: String,
    required: [true, 'must provide contact-number'],
    unique: true,
    minlength: 10,
    maxlength: [10, 'contact number should not contain more than 10 characters']
  },
  pincode: {
    type: Number,
    min: 100000,
    max: 999999,
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
  }
});

const sellerModel = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'must provide firstname'],
    trim: true,
    maxlength: [20, 'not more than 20 characters']
  },
  lastName: {
    type: String,
    required: [true, 'must provide lastname'],
    trim: true,
    maxlength: [20, 'not more than 20 characters']
  },
  emailId: {
    type: String,
    required: [true, 'must provide email'],
    unique: true,
    validate: [isEmail, 'please provide email'],
    trim: true
  },
  password: {
    type: String,
    required: [true, 'must provide password'],
    validate: [
      isStrongPassword,
      'please provide strong password with minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1'
    ]
  },
  contactNumber: {
    type: String,
    required: [true, 'must provide contact-number'],
    unique: true,
    minlength: 10,
    maxlength: [10, 'contact number should not contain more than 10 characters']
  },
  address: {
    type: sellerAddressSchema,
    required: true
  }
});
module.exports = mongoose.model('Seller', sellerModel);
