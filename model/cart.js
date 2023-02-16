const mongoose = require('mongoose')

// --> this is just temparary model to check all working well or not...
// --> need to update all ID's type 'String' to 'ObjectId'
const cartVariant = new mongoose.Schema({
    variantId: {
        type: String,
        required: true,
    },
    size: {
        type: String
    },
    color: {
        type: String
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    // images
})

// --> this is just temparary model to check all working well or not...
const cartProduct = new mongoose.Schema({
    productId: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    selectedVariants: {
        type: [cartVariant],
        validate: [val => val.length > 0, "at least select one variant"]
    }
})



// why reference not working in userId--------------------------problem------------
const Cart = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: 'user'
    },
    products: {
        type: [cartProduct],
        required: true,
        validate: [val => val.length > 0, "at least select one product"]
    }
})





module.exports = mongoose.model('cart', Cart)