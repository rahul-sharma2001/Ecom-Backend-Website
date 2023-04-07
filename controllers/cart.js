const uuid = require('uuid');
const { ObjectId } = require('mongodb');

const CartService = require('../services/cart');
const cartService = new CartService();
const uuid = require('uuid');
const { ObjectId } = require('mongodb');

async function createCart(req, res) {
  try {
    const savedCartData = await cartService.createCart(req.body);

    res.status(200).json({
      status: true,
      message: 'cart data inserted successfully',
      data: savedCartData
    });
  } catch (e) {
    res.status(500).json({
      status: false,
      message: `Server Error, ${e.message}`
    });
  }
}

async function getCart(req, res) {
  try {
    const { userId } = req.params;

    const cartData = await cartService.getCartData({
      userId
    });

    res.status(200).json({
      status: true,
      message: 'Cart data find successfully',
      data: cartData
    });
  } catch (e) {
    res.status(500).json({
      status: false,
      message: `Server Error, ${e.message}`
    });
  }
}

async function deleteCart(req, res) {
  try {
    const { userId } = req.params;

    const deletedCartData = await cartService.deleteCartByUserId({ userId });

    res.status(200).json({
      status: true,
      message: 'Cart deleted successfully'
    });
  } catch (e) {
    res.status(500).json({
      status: false,
      message: `Server Error, ${e.message}`
    });
  }
}

async function updateQtyInCart(req, res) {
  const { quantity } = req.body;
  const { userId, productId, variantId } = req.params;

  try {
    const previousCart = await cartService.updateCartByQuantity({
      userId,
      productId,
      variantId,
      quantity
    });

    res.status(200).json({
      status: true,
      message: 'successfully updated',
      quantity: quantity
    });
  } catch (e) {
    res.status(500).json({
      status: false,
      message: `Server Error, ${e.message}`
    });
  }
}

async function deleteProduct(req, res) {
  const { userId, productId, variantId } = req.params;

  try {
    const deletedCartData = await cartService.deleteProductFromCart({
      userId,
      productId,
      variantId
    });

    res.json({
      status: true,
      message: 'product deleted successfully',
      deletedCartData
    });
  } catch (e) {
    res.status(500).json({
      status: false,
      message: `Server Error, ${e.message}`
    });
  }
}

async function addProduct(req, res) {
  const { userId } = req.params;
  const { product } = req.body;

  try {
    const updatedCartData = await cartService.addProductInCart({
      userId,
      product
    });

    res.status(200).json({
      status: true,
      message: 'product add successfully'
    });
  } catch (e) {
    res.status(500).json({
      status: false,
      message: `Server Error, ${e.message}`
    });
  }
}

function generateTemporaryUserId() {
  my_uuid = uuid.v4();
  const tempId = ObjectId(my_uuid.hex);
  return tempId;
}

function createTemporaryUserId(req, res) {
  const temporayUserId = generateTemporaryUserId();
  res.json({ userId: temporayUserId });
}

async function handleBuyNow(req, res) {
  const { userId: userId } = req.params;
  const { tempId: tempId } = req.params;

  try {
    const compareCartData = await cartService.compareCartData(
      { _id: userId },
      { tempId: tempId }
    );
    res.status(200).json({
      status: true,
      data: compareCartData
    });
  } catch (e) {
    res.status(500).json({
      status: false,
      message: `Server Error, ${e.message}`
    });
  }
}

module.exports = {
  createCart,
  getCart,
  deleteCart,
  updateQtyInCart,
  deleteProduct,
  addProduct,
  createTemporaryUserId,
  handleBuyNow
};
