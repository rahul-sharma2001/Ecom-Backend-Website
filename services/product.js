const Product = require('../model/product')

class ProductServices {

    async updateVariantQuantityById({ productId, variantId, previousQuantity, newQuantity }) {

        // --> remaining = Quantity is always greater than or equal to 0 (qty >= 0), check this too...

        if (!productId || !variantId || (!previousQuantity && previousQuantity != 0) || (!newQuantity && newQuantity != 0)) {
            throw new Error("productId, variantId, previousQuantity and newQuantity are required field")
        }

        const updateVariantData = await Product.findOneAndUpdate(
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

        const variants = await Product.findOne({ _id: productId }).select('variants')

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

module.exports = ProductServices