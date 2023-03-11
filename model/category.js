const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'must provide name of category'],
    unique: [true, 'category is already created']
  },
  parent: {
    type: String,
    required: [true, 'must provide parent category']
  },
  category: {
    type: String,
    required: [true, 'must provide sub category']
  }
});

module.exports = mongoose.model('category', categorySchema);
