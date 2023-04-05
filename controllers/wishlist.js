const WishlistService = require('../services/wishlist');

let wishlistServices = new WishlistService();
const createWishlist = async (req, res) => {
  const wishlistData = req.body;
  try {
    const savedWishlistData = await wishlistServices.createWishlist(
      wishlistData
    );

    res.status(200).json({
      status: true,
      message: 'wishlist data inserted successfully',
      data: savedWishlistData
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
const getWishlist = async (req, res) => {
  try {
    const { userId: userId } = req.params;
    const WishlistData = await wishlistServices.getWishlist({ _id: userId });
    if (!WishlistData) {
      return res
        .status(404)
        .json({ status: false, message: `no wishlistdata with id: ${userId}` });
    }
    res.status(200).json({ status: true, wishlistData: WishlistData });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
const deleteWishlist = async (req, res) => {
  try {
    const { userId: userId } = req.params;
    const deleteWishlistData = await wishlistServices.deleteWishlist({
      _id: userId
    });
    res.status(200).json({
      status: true,
      message: 'wishlist deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
const addProduct = async (req, res) => {
  try {
    const { userId } = req.params;
    const { product } = req.body;
    console.log(userId,product)
    const updatedWishlistData = await wishlistServices.addProduct({
      userId,
      product
    });
    res.status(200).json({
      status: true,
      message: 'product added successfully',
      product: updatedWishlistData
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const deleteProduct = await wishlistServices.deleteProductFromWishlist({
      userId,
      productId
    });
    res.status(200).json({
      status: true,
      message: 'product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  createWishlist,
  getWishlist,
  addProduct,
  deleteProduct,
  deleteWishlist
};
