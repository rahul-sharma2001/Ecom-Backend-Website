const mongoose = require('mongoose');
const { isEmail } = require('validator');
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
    required: [true, 'must provide password']
  },
  contactNumber: {
    type: String,
    unique: true,
    required: [true, 'must provide contact-number'],
    maxlength: [10, 'contact should have 10 characters']
  },
  role: {
    type: String,
    trim: true,
    default: 'user'
  }
});

//for not showing password in json obj
// userSchema.methods.toJSON = function() {
//     var obj = this.toObject();
//     delete obj.password;
//     return obj;
//   }

module.exports = mongoose.model('user', userSchema);
