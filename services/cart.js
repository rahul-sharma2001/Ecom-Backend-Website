const Cart = require('../model/cart');
const userModel = require('../model/user');
const ProductService = require('./product');
const productService = new ProductService();

class CartService {
  async createCart(cartData) {
    const { userId, products } = cartData;

    if (!userId || !products) {
      throw new Error(
        'Required fields = userId and products, some of this not provided'
      );
    }

    const newCart = new Cart({
      userId,
      products
    });

    const savedCartData = await newCart.save();

    if (!savedCartData) {
      throw new Error('cart data not stored');
    }

    // --> update in variant collection using variant id, decrease noOfProducts of all the products

    for (const product of products) {
      for (const variant of product.selectedVariants) {
        const updateVariantData =
          await productService.updateVariantQuantityById({
            productId: product.productId,
            variantId: variant.variantId,
            previousQuantity: 0,
            newQuantity: variant.quantity
          });

        // --> if any of the variant not updated and throw Error then think how to solve (ex. think how to revert previous update)
      }
    }
  }

  async getCartData({ userId }) {
    if (!userId) {
      throw new Error('userId is required field');
    }

    const cartData = await Cart.findOne({ userId }).lean(true);

    if (!cartData) {
      throw new Error('cart not found');
    }

    for (let i = 0; i < cartData.products.length; i++) {
      cartData.products[i]['allVariants'] =
        await productService.getAllVariantsOfProduct({
          productId: cartData.products[i].productId,
          strict: false
        });
    }

    return cartData;
  }

  async updateCartByQuantity({ userId, productId, variantId, quantity }) {
    if (!userId || !productId || !variantId || !quantity) {
      throw new Error(
        'Required fields = userId, productId, variantId and Quantity, some of this not provided'
      );
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
    );

    if (!previousCart) {
      throw new Error('no cart data found for given product or variant');
    }

    const previousProduct = this.getProductFromCartById({
      cartData: previousCart,
      productId
    });

    const previousVariant = productService.getVariantFromProductById({
      productData: previousProduct,
      variantId
    });

    // --> if variant not updated and throw Error then think how to solve (ex. think how to revert previous update)
    const updatedVariant = await productService.updateVariantQuantityById({
      productId,
      variantId,
      previousQuantity: previousVariant.quantity,
      newQuantity: quantity
    });
  }

  async deleteCartByUserId({ userId }) {
    if (!userId) {
      throw new Error('userId is required field');
    }

    const deletedCart = await Cart.findOneAndDelete({
      userId
    });

    if (!deletedCart) {
      throw new Error('no cart data found');
    }

    // --> update in variant collection using variant id, increase noOfProducts of all the products
    const { products } = deletedCart;

    for (const product of products) {
      for (const variant of product.selectedVariants) {
        const updateVariantData =
          await productService.updateVariantQuantityById({
            productId: product.productId,
            variantId: variant.variantId,
            previousQuantity: variant.quantity,
            newQuantity: 0
          });

        // --> if any of the variant not updated and throw Error then think how to solve (ex. think how to revert previous update)
      }
    }
  }

  async addProductInCart({ userId, product }) {
    if (!userId || !product) {
      throw new Error('Required field = userId and product');
    }

    // check cart
    const cartData = await Cart.findOne({ userId });

    // - no
    if (!cartData) {
      const createdCart = await this.createCart({
        userId,
        products: [product]
      });
      return;
    }

    // - yes
    else {
      // check product
      const productIndex = cartData.products.findIndex(
        val => val.productId == product.productId
      );
      const productInCart = cartData.products[productIndex];

      // - no
      if (!productInCart) {
        const updatedData = this.#addNewProductInCart({
          userId,
          product
        });
        return;
      }

      // - yes
      else {
        // check variant
        for (let i = 0; i < product.selectedVariants.length; i++) {
          const variantIndex = productInCart.selectedVariants.findIndex(
            variant =>
              variant.variantId == product.selectedVariants[i].variantId
          );

          let newQuantity = 0;
          let previousQuantity = 0;

          // - no
          if (variantIndex === -1) {
            productInCart.selectedVariants.push(product.selectedVariants[i]);
            newQuantity = product.selectedVariants[i].quantity;
          }

          // - yes
          else {
            previousQuantity =
              productInCart.selectedVariants[variantIndex].quantity;
            newQuantity =
              previousQuantity + product.selectedVariants[i].quantity;

            productInCart.selectedVariants[variantIndex].quantity = newQuantity;
          }

          const updatedProduct = await productService.updateVariantQuantityById(
            {
              productId: product.productId,
              variantId: product.selectedVariants[i].variantId,
              previousQuantity,
              newQuantity
            }
          );
        }

        cartData.products[productIndex] = productInCart;

        const savedCartData = await cartData.save();
      }
    }
  }

  async #addNewProductInCart({ userId, product }) {
    if (!userId || !product) {
      throw new Error('Required field = userId and product');
    }

    const updatedData = await Cart.findOneAndUpdate(
      {
        userId
      },
      {
        $push: {
          products: [product]
        }
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedData) {
      throw new Error('no cart data found');
    }

    for (const variant of product.selectedVariants) {
      const updatedVariant = await productService.updateVariantQuantityById({
        productId: product.productId,
        variantId: variant.variantId,
        previousQuantity: 0,
        newQuantity: variant.quantity
      });
    }
  }

  async deleteProductFromCart({ userId, productId, variantId }) {
    if (!userId || !productId || !variantId) {
      throw new Error('Required field = userId, productId and variantId');
    }

    const deletedCartData = await this.deleteProductVariantFromCart({
      userId,
      productId,
      variantId
    });

    const deletedProductData = this.getProductFromCartById({
      cartData: deletedCartData,
      productId
    });

    const deletedVariant = deletedProductData.selectedVariants.find(
      variant => variant.variantId == variantId
    );

    if (!deletedVariant) {
      if (deletedProductData.selectedVariants.length === 0) {
        const deletedProductCartData = await this.deleteProductFromCartById({
          userId,
          productId
        });
      } else {
        throw new Error('variant not found in product');
      }
    } else {
      if (deletedProductData.selectedVariants.length === 1) {
        const deletedProductCartData = await this.deleteProductFromCartById({
          userId,
          productId
        });
      }

      const deletedVariant = productService.getVariantFromProductById({
        productData: deletedProductData,
        variantId
      });

      const updatedVariant = await productService.updateVariantQuantityById({
        productId,
        variantId,
        previousQuantity: deletedVariant.quantity,
        newQuantity: 0
      });
    }

    return deletedCartData;
  }

  async deleteProductVariantFromCart({ userId, productId, variantId }) {
    if (!userId || !productId || !variantId) {
      throw new Error('Required field = userId, productId and variantId');
    }

    const deletedCartData = await Cart.findOneAndUpdate(
      {
        userId,
        'products.productId': productId
      },
      {
        $pull: {
          'products.$.selectedVariants': {
            variantId
          }
        }
      },
      {
        new: false,
        runValidators: true
      }
    );

    if (!deletedCartData) {
      throw new Error('cart not found');
    }

    return deletedCartData;
  }

  async deleteProductFromCartById({ userId, productId }) {
    if (!userId || !productId) {
      throw new Error('Required field = userId and productId');
    }

    const deletedProductCartData = await Cart.findOneAndUpdate(
      {
        userId
      },
      {
        $pull: {
          products: {
            productId
          }
        }
      },
      {
        new: false,
        runValidators: true
      }
    );

    if (!deletedProductCartData) {
      throw new Error('cart not found');
    }

    return deletedProductCartData;
  }

  getProductFromCartById({ cartData, productId, strict = true }) {
    if (!cartData || !productId) {
      throw new Error('cartdata and productId are required');
    }

    const product = cartData.products.find(
      product => product.productId == productId
    );

    if (strict && !product) {
      throw new Error('product not available in cart');
    }

    return product;
  }

  async compareCartData(id, tempId) {
    const existingUser = await userModel.findOne(id);
    if (existingUser == null) {
      const data = await Cart.findOne(id).lean(true);
      return { existingUser: false, data: data };
    } else {
      const objectId = existingUser.cartProductsInTempId;
      const userIdObject = { userId: objectId.toString() };

      const actualCartData = await Cart.find(userIdObject);
      return {
        existingUser: true,
        data: actualCartData,
        exisitingUserData: existingUser
      };
    }
  }
}

module.exports = CartService;
