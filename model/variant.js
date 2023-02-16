const mongoose = require('mongoose')

// --> product id reference to product table 
// --> this is just temparary models to check all working well or not...
const Varient = new mongoose.Schema({
    productId: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        validate: [val => val.length > 0, "minimum one photo required"]
    },
    size: {
        type: String
    },
    color: {
        type: String
    },
    noOfProducts: {
        type: Number,
        required: true,
        min: 0
    },
})

module.exports = mongoose.model('Variant', Varient)