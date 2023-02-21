const Cart = require('../model/cart')
const Variant = require('../model/product');

const ProductServices = require('../services/product');
const productServices = new ProductServices();

const CartService = require('../services/cart')
const cartService = new CartService();

async function createCart(req, res) {
    try {
        const savedCartData = await cartService.createCart(req.body)

        res.status(200).json({
            status: true,
            message: "cart data inserted successfully",
            data: savedCartData
        })

    } catch (e) {
        res.status(500).json({
            status: false,
            message: `Server Error, ${e.message}`
        })
    }
}

async function getCart(req, res) {
    try {
        const { userId } = req.params;

        const cartData = await cartService.getCartData(
            {
                userId
            }
        )

        res.status(200).json({
            status: true,
            message: "Cart data find successfully",
            data: cartData
        })

    } catch (e) {
        res.status(500).json({
            status: false,
            message: `Server Error, ${e.message}`
        })
    }
}

async function deleteCart(req, res) {
    try {
        const { userId } = req.params;

        const deletedCartData = await cartService.deleteCartByUserId({ userId })

        res.status(200).json({
            status: true,
            message: "Cart deleted successfully"
        })

    } catch (e) {
        res.status(500).json({
            status: false,
            message: `Server Error, ${e.message}`
        })
    }
}

async function updateQtyInCart(req, res) {
    const { quantity } = req.body;
    const { userId, productId, variantId } = req.params;

    try {
        const previousCart = await cartService.updateCartByQuantity(
            {
                userId,
                productId,
                variantId,
                quantity
            }
        );

        res.status(200).json({
            status: true,
            message: "successfully updated"
        })

    } catch (e) {
        res.status(500).json({
            status: false,
            message: `Server Error, ${e.message}`
        })
    }
}

async function deleteProduct(req, res) {
    const { userId, productId, variantId } = req.params;

    try {

        const deletedCartData = await cartService.deleteProductFromCart(
            {
                userId,
                productId,
                variantId
            }
        )

        res.json({
            status: true,
            message: "product deleted successfully",
            deletedCartData
        })

    } catch (e) {
        res.status(500).json({
            status: false,
            message: `Server Error, ${e.message}`
        })
    }
}

async function addProduct(req, res) {

    const { userId } = req.params;
    const { product } = req.body;
    
    try {

        const updatedCartData = await cartService.addProductInCart( 
            {
                userId,
                product
            }
        )

        res.status(500).json({
            status: true,
            message: "product add successfully"
        })

    }
    catch (e) {
        res.status(500).json({
            status: false,
            message: `Server Error, ${e.message}`
        })
    }
}



module.exports = {
    createCart,
    getCart,
    deleteCart,
    updateQtyInCart,
    deleteProduct,
    addProduct,
}