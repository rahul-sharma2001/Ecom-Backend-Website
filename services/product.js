const { productSchema } = require('../model/product')

class ProductService {

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
        const { name, sort, fields, gender, category, brand,maxPrice,minPrice,color,availability,sellerId } = body;
        const productQuery = {};
        if(sellerId){
            productQuery.sellerId = sellerId;
        }
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
            productQuery.category = category;
        }
        if(color){
            productQuery['variants.color']= color;
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
        if(maxPrice || minPrice){

        }
        if(availability){
            products = products.find({'variants.noOfProducts' :{$gt : 0}} ) ; 
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

    async DeleteVariant(productId, variantId) {
        try {
            if (!productId) {
                throw new Error('product id is require');
            }
           const deleteVariant= await productSchema.findOneAndUpdate({_id:productId},{$pull :{variants:{_id:variantId}}});
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

    async updateVariantQuantityById({ productId, variantId, previousQuantity, newQuantity }) {

        // --> remaining = Quantity is always greater than or equal to 0 (qty >= 0), check this too...

        if (!productId || !variantId || (!previousQuantity && previousQuantity != 0) || (!newQuantity && newQuantity != 0)) {
            throw new Error("productId, variantId, previousQuantity and newQuantity are required field")
        }

        const updateVariantData = await productSchema.findOneAndUpdate(
            {
                _id: productId,
                'variants._id': variantId
            },
            {
                $inc: {
                    'variants.$.noOfProducts': (previousQuantity - newQuantity)
                }
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updateVariantData) {
            throw new Error("this variant not selected in product")
        }

        return updateVariantData
    }

    async getAllVariantsOfProduct({ productId, strict = true }) {
        if (!productId) {
            throw new Error("productId is required field")
        }

        const variants = await productSchema.findOne({ _id: productId }).select('variants')

        if(strict && !variants) {
            throw new Error("Product not found")
        }

        return variants;
    }


    getVariantFromProductById({ productData, variantId, strict = true }) {
        if (!productData || !variantId) {
            throw new Error("productData and variantId are required")
        }

        const variant = productData.selectedVariants.find(variant => variant.variantId == variantId)

        if (strict && !variant) {
            throw new Error("variant not available in product")
        }

        return variant;
    }
}

module.exports = ProductService
