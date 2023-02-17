const mongoose = require('mongoose');
const { isEmail, isStrongPassword } = require('validator');

//temperary address schema
const addressSchema = new mongoose.Schema({
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'must provide UserId']
  },
  addressType: {
    type: String,
    required: [true, 'must provide addressType'],
    enum: ['home', 'work']
  },
  name: {
    type: String,
    required: [true, 'must provide name'],
    trim: true,
    maxlength: [20, 'not more than 20 characters']
  },
  contactNumber: {
    type: String,
    required: [true, 'must provide contact-number'],
    maxlength: [10, 'must provide 10 digit number']
  },
  pincode: {
    type: Number,
    required: [true, 'must provide pincode'],
    maxlength: [6, 'pincode consists of 6 digits']
  },
  street: {
    type: String,
    required: false
  },
  locality: {
    type: String,
    required: false
  },
  city: {
    type: String,
    required: [true, 'must provide city']
  },
  state: {
    type: String,
    required: [true, 'must provide state']
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
    validate: [isEmail, ' PLEASE PROVIDE VALID EMAIL'],
    trim: true
  },
  password: {
    type: String,
    required: [true, 'must provide password'],
    validate: [isStrongPassword, 'please provide strong password']
  },
  contactNumber: {
    type: String,
    required: [true, 'must provide contact-number'],
    unique: true,
    maxlength: [10, 'contact number should not contain more than 10 characters']
  },
  address: addressSchema
});
mongoose.model('Address', addressSchema);
module.exports = mongoose.model('seller', sellerModel);
