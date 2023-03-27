const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    sellerId : {
        type : String,
    },
    name : {
        type : String,
        required: [true, 'must provide product name']
    },
    image: {
        type: String,
        require: true
    },
    brand :{
        type: String,
        require: true
    },
    productDetails: {
        type:Object
    },
    category:{
        type: String,
        required:[true , 'must provide category of product'],
        trim: true
    },
    variants :[{
        images: {
            type: [String],
            required : true
        },
        price :{
            type: Number,
            required:[true , 'must provide product price']
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
}]
});

const productModel = mongoose.model('product', productSchema);

module.exports  ={
    productSchema : productModel
}