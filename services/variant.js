const Variant = require('../model/variant')

class VariantServices {

    async updateVariantQuantityById({ variantId, previousQuantity, newQuantity }) {

        // --> remaining = Quantity is always greater than or equal to 0 (qty >= 0), check this too...

        if (!variantId || (!previousQuantity && previousQuantity != 0) || (!newQuantity && newQuantity != 0)) {
            throw new Error("variantId, previousQuantity and newQuantity are required field")
        }

        const updateVariantData = await Variant.findOneAndUpdate(
            {
                _id: variantId
            },
            {
                $inc: {
                    noOfProducts: (previousQuantity - newQuantity)
                }
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updateVariantData) {
            return null
        }

        return updateVariantData
    }


    getVariantFromProductById({ productData, variantId }) {
        if (!productData || !variantId) {
            throw new Error("productData and variantId are required")
        }

        const variant = productData.selectedVariants.find(variant => variant.variantId == variantId)

        if (!variant) {
            throw new Error("variant not available in product")
        }

        return variant;
    }
}

module.exports = VariantServices