const { productSchema, variantSchema } = require('../model/product')
const mpongoose = require('mongoose');
const { $where } = require('../model/user');

class productService {

    //create product
    async createProduct(productInfo) {
        const { sellerId, name, images, price, productDetails, category, variant } = productInfo;
        try {
            if (!productInfo) {
                throw new Error('product Details are required');
            }
            const savedProduct = await productSchema.create({ sellerId, name, images, price, productDetails, category });
            if (savedProduct) {
                if (variant) {
                    console.log(variant)
                    const productId = savedProduct._id;
                    variant.forEach(async (variant) => {
                        const {images,size,color,noOfProducts }= variant;
                        const savedVariant = await variantSchema.create({productId , images , size , color ,noOfProducts});
                        console.log(savedVariant);
                    });
                }
                return savedProduct;
            } else {
                return null;
            }
        } catch (error) {
            throw error;
        }
    }
    //get all product after applying filter
    async getAllProduct(body) {
        const {sort , fields , gender, category , brand, numericFilters, color} = body;
        console.log(body);
        const productQuery = {};
        //const variantQuery = {};

        if(gender){
            productQuery['productDetails.gender'] = gender;
        }
        if(category){
            console.log('category')
            productQuery.category = category;
        }
        if(brand){
            productQuery['productDetails.brand'] = brand;
        }
        
      //  console.log(productQuery);
        let products = productSchema.find(productQuery);
        let variant = variantSchema.find();
        if(sort){
            const sortList = sort.split(',').join(' ');
             products = products.sort(sortList);
        }
        if(fields){
            const fieldList = fields.split(',').join(' ');
            products = products.select(fieldList);
        }

        const page = Number(body.page) || 1;
        const limit = Number(body.limit) || 24;
        const skip = (page - 1) * limit;
        products= products.skip(skip).limit(limit);
        const filterProduct = await products;
        return filterProduct;
    }

    //get one product
    async getOneProduct(productId) {
        try {
            if (!productId) {
                throw new Error('product id is require');
            }
            const productInfo = await productSchema.findOne({ _id: productId });
            console.log(productInfo);
            if (productInfo) {
                const productVariant = await variantSchema.find({ productId });
                const getProduct = {
                    productInfo: productInfo,
                    productVariant: productVariant
                }
                console.log(getProduct);
                return getProduct;
            } else {
                return null;
            }
        } catch (error) {
            throw error;
        }
    }


    //delete product
    async deleteProduct(productId) {
        try {
            if (!productId) {
                throw new Error('product id is require');
            }
            const deleteProductInfo = await productSchema.findOneAndDelete({ _id: productId });
            if (deleteProductInfo) {
                const deleteVariant = await variantSchema.deleteMany({ productId });
                const deletedProduct = {
                    productInfo: deleteProductInfo,
                    variant: deleteVariant
                }
                console.log(deletedProduct);
                return deletedProduct;
            } else {
                return null;
            }
        } catch (error) {
            throw error;
        }
    }

    async deleteVariant(varientId) {
        try {
            if (!varientId) {
                throw new Error('variant id is require');
            }
            const deletevariant = await variantSchema.findOneAndDelete({ _id: varientId });
            if (deletevariant) {
                return deletevariant;
            } else {
                return null;
            }
        } catch (error) {
            throw error;
        }
    }
    //update product
    async updateProduct(productId, bodyData) {
        try {
            if (!productId) {
                throw new Error('product id is require');
            };
            if (bodyData.hasOwnProperty('productUpdate')) {
                console.log('update product')
                const updatedProduct = await productSchema.findOneAndUpdate({ _id: productId }, bodyData.productUpdate, {
                    new: true,
                    runValidators: true,
                });
            }
            if (bodyData.hasOwnProperty('variantUpdate')) {
                const variant = bodyData.variantUpdate;
                console.log(bodyData.variantUpdate);
                variant.forEach(async (variant) => {
                    const variantId = variant._id;
                    const updatedProduct = await variantSchema.findOneAndUpdate({ _id: variantId }, variant, {
                        new: true,
                        runValidators: true,
                    });
                    return updatedProduct;
                });
            }
        } catch (error) {
            throw error;
        }
    }
}

module.exports = productService