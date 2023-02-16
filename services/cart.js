const Cart = require('../model/cart')

class CartService {

    async createCart(cartData) {
        const { userId, products } = cartData;

        if (!userId || !products) {
            throw new Error("Required fields = userId and products, some of this not provided")
        }

        const newCart = new Cart({
            userId,
            products
        })

        const dataStored = await newCart.save();

        if (!dataStored) {
            throw new Error("cart data not stored")
        }

        return dataStored;
    }

    async updateCartByQuantity({ userId, productId, variantId, quantity }) {

        if (!userId || !productId || !variantId || !quantity) {
            throw new Error("Required fields = userId, productId, variantId and Quantity, some of this not provided")
        }

        const previousCart = await Cart.findOneAndUpdate(
            {
                userId,
                'products.productId': productId,
                'products.selectedVariants.variantId': variantId
            },
            {
                'products.$.selectedVariants.$[variant].quantity': quantity
            },
            {
                arrayFilters: [{ 'variant.variantId': variantId }],
                new: false,
                runValidators: true
            }
        )

        if (!previousCart) {
            throw new Error("no cart data found")
        }

        return previousCart;
    }

    async updateCartByNewVariant({ userId, productId, newVariant }) {
        if (!userId || !productId || !newVariant) {
            throw new Error("Required fields = userId, productId and newVariant, some of this not provided")
        }

        const previousCart = await Cart.findOneAndUpdate(
            {
                userId,
                'products.productId': productId
            },
            {
                'products.$.selectedVariants': newVariant
            },
            {
                new: false,
                runValidators: true
            }
        );

        if (!previousCart) {
            throw new Error("no cart data found")
        }

        return previousCart;
    }

    async deleteCartByUserId({ userId }) {
        if (!userId) {
            throw new Error("userId is required field")
        }

        const deletedCart = await Cart.findOneAndDelete(
            {
                userId
            },
        );

        if (!deletedCart) {
            throw new Error("no cart data found")
        }

        return deletedCart
    }




    getProductFromCartById({ cartData, productId }) {
        if (!cartData || !productId) {
            throw new Error("cartdata and productId are required")
        }

        const product = cartData.products.find(product => product.productId == productId)

        if (!product) {
            throw new Error("product not available in cart")
        }

        return product;
    }

}

module.exports = CartService