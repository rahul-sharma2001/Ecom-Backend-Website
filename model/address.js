const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId
  },
  addressType: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  contactNo: {
    type: Number,
    min: 10,
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
  }
});

const addressModel = mongoose.model('Address', addressSchema);

module.exports = { addressModel, addressSchema };
