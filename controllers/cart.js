const Cart = require('../model/cart')
const Variant = require('../model/variant');

const VariantServices = require('../services/variant');
const variantServices = new VariantServices();

const CartService = require('../services/cart')
const cartService = new CartService();

async function createCart(req, res) {
    console.log("Cart data = ", req.body);

    try {
        const savedCartData = await cartService.createCart(req.body)


        // --> update in variant collection using variant id, decrease noOfProducts of all the products
        const { products } = savedCartData;

        for (const product of products) {

            for (const variant of product.selectedVariants) {
                const updateVariantData = await variantServices.updateVariantQuantityById(
                    {
                        variantId: variant.variantId,
                        previousQuantity: 0,
                        newQuantity: variant.quantity
                    }
                );

                // --> if any of the variant not updated and throw Error then think how to solve (ex. think how to revert previous update)
                console.log(`Updated variant = ${updateVariantData} `);
            }

        };

        res.status(200).json({
            status: true,
            message: "cart data inserted successfully",
            // savedCartData
        })

    } catch (e) {
        console.log("error = ", e);
        res.status(500).json({
            status: false,
            message: `Server Error, ${e.message}`
        })
    }
}

async function getCart(req, res) {
    console.log("params = ", req.params);
    // --> remaining = also send the variant object array 

    try {
        const { userId } = req.params;

        const cartData = await Cart.findOne({ userId });

        if (!cartData) {
            return res.status(200).json({
                status: false,
                message: "user's cart not exists, please add products to the cart first"
            })
        }

        res.status(200).json({
            status: true,
            cartData
        })

    } catch (e) {
        console.log("error = ", e);
        res.status(500).json({
            status: false,
            message: `Server Error, ${e.message}`
        })
    }
}

async function deleteCart(req, res) {
    console.log("params = ", req.params);
    // --> update cart, variant collection

    try {
        const { userId } = req.params;

        const deletedCartData = await cartService.deleteCartByUserId({ userId })

        // --> update in variant collection using variant id, increase noOfProducts of all the products
        const { products } = deletedCartData;

        for (const product of products) {
            for (const variant of product.selectedVariants) {
                const updateVariantData = await variantServices.updateVariantQuantityById(
                    {
                        variantId: variant.variantId,
                        previousQuantity: variant.quantity,
                        newQuantity: 0
                    }
                );

                // --> if any of the variant not updated and throw Error then think how to solve (ex. think how to revert previous update)
                console.log(`Updated variant = ${updateVariantData} `);
            }

        };



        if (!deletedCartData) {
            return res.status(200).json({
                status: false,
                message: "user not exists, please signup first"
            })
        }

        res.status(200).json({
            status: true,
            message: "Cart deleted successfully",
            deletedCartData
        })

    } catch (e) {
        console.log("error = ", e);
        res.status(500).json({
            status: false,
            message: `Server Error, ${e.message}`
        })
    }
}

async function updateCart(req, res) {

    // --> updatation of new variant on cart page is temparary removed, user can only update the qty of the product

    const { quantity } = req.body;
    const { userId, productId, variantId } = req.params;

    console.log("qty = ", quantity);

    try {

        if (quantity) {
            const previousCart = await cartService.updateCartByQuantity(
                {
                    userId,
                    productId,
                    variantId,
                    quantity
                }
            );

            const previousProduct = cartService.getProductFromCartById(
                {
                    cartData: previousCart,
                    productId
                }
            );

            const previousVariant = variantServices.getVariantFromProductById(
                {
                    productData: previousProduct,
                    variantId
                }
            )
            
            // --> if variant not updated and throw Error then think how to solve (ex. think how to revert previous update)
            const updatedVariant = await variantServices.updateVariantQuantityById(
                {
                    variantId: previousVariant.variantId,
                    previousQuantity: previousVariant.quantity,
                    newQuantity: quantity
                }
            );

            res.status(200).json({
                status: true,
                message: "successfully updated"
            })

        }
        // else if (newVariant) {
        //     const previousCart = await cartService.updateCartByNewVariant(
        //         {
        //             userId,
        //             productId,
        //             newVariant
        //         }
        //     )

        //     const previousProduct = cartService.getProductFromCartById(
        //         {
        //             cartData: previousCart,
        //             productId
        //         }
        //     );


        //     const updatePreviousVariant = await variantServices.updateVariantQuantityById(
        //         {
        //             variantId: previousProduct.selectedVariants.variantId,
        //             previousQuantity: previousProduct.quantity,
        //             newQuantity: 0
        //         }
        //     );


        //     const updateNewVariant = await variantServices.updateVariantQuantityById(
        //         {
        //             variantId: newVariant.variantId,
        //             previousQuantity: 0,
        //             newQuantity: previousProduct.quantity
        //         }
        //     );



        //     res.status(200).json({
        //         previousCart,
        //         updatePreviousVariant,
        //         updateNewVariant
        //     })
        // }


    } catch (e) {
        console.log("error = ", e);
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
    updateCart
}