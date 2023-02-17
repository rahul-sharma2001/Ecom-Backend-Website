const { productSchema } = require('../model/product')

class productService {

    async CreateProduct(productInfo) {
        try {
            if (!productInfo) {
                throw new Error('product Details are required');
            }
            const savedProduct = await productSchema.create(productInfo);
                return savedProduct;
        } catch (error) {
            throw error;
        }
    }

    async GetAllProduct(body) {
        const { name, sort, fields, gender, category, brand,numericFilters, color, availability } = body;
        const productQuery = {};
        if(name){
            productQuery.name = name;
        }
        if (gender) {
            productQuery['productDetails.gender'] = gender;
        }
        if (brand) {
            productQuery['productDetails.brand'] = brand;
        }
        if (category) {
            console.log('category')
            productQuery.category = category;
        }
        if(color){
            productQuery['varients.color']= color;
        }
        let products = productSchema.find(productQuery);
        if (sort) {
            const sortList = sort.split(',').join(' ');
            products = products.sort(sortList);
        }
        if (fields) {
            const fieldList = fields.split(',').join(' ');
            products = products.select(fieldList);
        }
        if(availability){
            products = products.find({'varients.noOfProducts' :{$gt : 0}} ) ; 
        }
        const page = Number(body.page) || 1;
        const limit = Number(body.limit) || 24;
        const skip = (page - 1) * limit;
        products = products.skip(skip).limit(limit);
        const filterProduct = await products;
        return filterProduct;
    }

    async GetOneProduct(productId) {
        try {
            if (!productId) {
                throw new Error('product id is require');
            }
            const product = await productSchema.findOne({ _id: productId });
                return product;
        } catch (error) {
            throw error;
        }
    }


    async DeleteProduct(productId) {
        try {
            if (!productId) {
                throw new Error('product id is require');
            }
            const deleteProductInfo = await productSchema.findOneAndDelete({ _id: productId });
        } catch (error) {
            throw error;
        }
    }

    async DeleteVariant(productId, varientId) {
        try {
            if (!productId) {
                throw new Error('product id is require');
            }
           const deleteVariant= await productSchema.findOneAndUpdate({_id:productId},{$pull :{varients:{_id:varientId}}});
        } catch (error) {
            throw error;
        }
    }

    async UpdateProduct(productId, bodyData) {
        try {
            if (!productId) {
                throw new Error('product id is require');
            };
            const updatedProduct = await productSchema.findOneAndUpdate({ _id: productId }, bodyData, {
                new: true,
                runValidators: true,
            });
                return updatedProduct;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = productService