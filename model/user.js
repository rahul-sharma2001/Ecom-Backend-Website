const mongoose = require('mongoose');

const { isEmail, isStrongPassword } = require('validator');

const userSchema = new mongoose.Schema({
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
    index: true,
    validate: [isEmail, ' PLEASE PROVIDE VALID EMAIL'],
    trim: true
  },
  password: {
    type: String,
    required: [true, 'must provide password'],
    validate: [isStrongPassword, 'provide strong password']
  },
  contactNumber: {
    type: String,
    unique: true,
    index: true,
    required: [true, 'must provide contact-number'],
    minlength: 10,
    maxlength: [10, 'contact number should consist of 10 digits']
  },
  role: {
    type: String,
    trim: true,
    enum: ['user', 'admin', 'seller']
  }
  // sellerOnlyField: {
  //   type: String,
  //   required: function () {
  //     return this.role === 'seller';
  //   }
  // }
});

module.exports = mongoose.model('User', userSchema);
