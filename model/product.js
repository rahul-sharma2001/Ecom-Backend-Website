const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    sellerId : {
        type : String,
    },
    name : {
        type : String,
        required: [true, 'must provide product name']
    },
    images : {
        type : [String],
        require :true
    },
    price :{
        type: Number,
        required:[true , 'must provide product price']
    },
    productDetails : {
        type : {
            gender : String,
            brand : String,
        },
        required: [true,'must provide product details'],
        trim : true
    },
    category:{
        type: String,
        required:[true , 'must provide category of product'],
        trim: true
    }
});

const productModel = mongoose.model('product', productSchema);

const variantSchema = new mongoose.Schema({
    productId :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required : [true , 'must provide product id']
    },
    images: {
        type: [String],
        required : true
    },
    size:{
        type: String,
        required:[true , 'must provide product size']
    },
    color:{
        type: String,
        required : true
    },
    noOfProducts:{
        type: Number,
        required: true
    } 
});

const variantModel = mongoose.model('variant', variantSchema);
module.exports  ={
    productSchema : productModel,
    variantSchema : variantModel
}