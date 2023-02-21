const mongoose = require('mongoose')

const cartVariant = new mongoose.Schema({
    variantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    images: {
        type: [String]
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
    }
})

const cartProduct = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
    },
    name: {
        type: String,
        required: true,
    },
    productDetails: {
        type: Object
    },
    images: {
        type: [String]
    },
    selectedVariants: {
        type: [cartVariant],
        validate: [val => val.length > 0, "at least select one variant"]
    }
})

// --> why reference not working in userId--------------------------problem------------
const Cart = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user',
        unique: true
    },
    products: {
        type: [cartProduct],
        required: true,
        validate: [val => val.length > 0, "at least select one product"]
    }
})

module.exports = mongoose.model('Cart', Cart)