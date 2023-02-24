const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    sellerId: {
        type: String,
    },
    name: {
        type: String,
        required: [true, 'must provide product name']
    },
    images: {
        type: [String],
        require: true
    },
    productDetails: {
        type: {
            gender: String,
            brand: String,
        },
        required: [true, 'must provide product details'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'must provide category of product'],
        trim: true
    },
    variants: [{
        images: {
            type: [String],
            required: true
        },
        price: {
            type: Number,
            required: [true, 'must provide product price']
        },
        size: {
            type: String,
            required: [true, 'must provide product size']
        },
        color: {
            type: String,
            required: true
        },
        noOfProducts: {
            type: Number,
            required: true
        }
    }]
});

const productModel = mongoose.model('product', productSchema);

module.exports = {
    productSchema: productModel
}