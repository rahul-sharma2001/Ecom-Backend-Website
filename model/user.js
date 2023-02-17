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
    validate: [isEmail, ' PLEASE PROVIDE VALID EMAIL'],
    trim: true
  },
  password: {
    type: String,
    required: [true, 'must provide password'],
    validate: [isStrongPassword, 'provide strong password']
  },
  contactNumber: {
    type: Number,
    unique: true,
    required: [true, 'must provide contact-number'],
    min: 10,
    max: [10, 'contact number should not contain more than 10 characters']
  },
  role: {
    type: String,
    trim: true,
    default: 'user'
  }
});

module.exports = mongoose.model('user', userSchema);
