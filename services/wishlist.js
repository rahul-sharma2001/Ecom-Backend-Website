const { deleteWishlist } = require('../controllers/wishlist');
const WishlistModel = require('../model/wishlist');

class WishlistService {
  async createWishlist(wishlistdata) {
    const { userId, products } = wishlistdata;
    try {
      if (!userId || !products) {
        throw new Error('userId and products are required');
      }
      const savedWishlistData = await WishlistModel.create(wishlistdata);
      return savedWishlistData;
    } catch (error) {
      throw error;
    }
  }
  async getWishlist(id) {
    try {
      if (!id) {
        throw new Error('userId is required');
      }
      const getWishlist = await WishlistModel.findOne({ userId: id });
      if (getWishlist === null) {
        return 'no data with this id';
      }
      return getWishlist;
    } catch (error) {
      throw error;
    }
  }
  async deleteWishlist(id) {
    try {
      if (!id) {
        throw new Error('userId is required');
      }

      const deletedWishlist = await WishlistModel.findOneAndDelete(id);

      if (!deletedWishlist) {
        throw new Error('no wishlist data found');
      }
    } catch (error) {
      throw error;
    }
  }
  async addProduct({ userId, product }) {
    try {
      if (!userId || !product) {
        throw new Error('userId and product are required');
      }

      //chect for wishlist
      const WishlistData = await WishlistModel.findOne({ userId });
      // no wishlist
      if (!WishlistData) {
        const createWishlist = await this.createWishlist({
          userId,
          products: [product]
        });
        return createWishlist;
      }
      // wishlist is there and check for product repeat
      const productIndex = WishlistData.products.findIndex(
        val => val.productId == product.productId
      );

      // - no repeat
      if (productIndex === -1) {
        const updatedData = await this.#addNewProductInWishlist({
          userId,
          product
        });
        return updatedData;
      }
      //yes
      else {
        return 'Product already exists in your wishlist';
      }
    } catch (error) {
      throw error;
    }
  }
  async #addNewProductInWishlist({ userId, product }) {
    if (!userId || !product || !product.productId) {
      throw new Error('Required field = userId and product.productId');
    }

    const updatedWishlistData = await WishlistModel.findOneAndUpdate(
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
    if (!updatedWishlistData) {
      throw new Error('no wishlist data found');
    }

    return updatedWishlistData;
  }
  async deleteProductFromWishlist({ userId, productId }) {
    try {
      if (!userId || !productId) {
        throw new Error('Required field = userId and productId');
      }
      const deletedProduct = await WishlistModel.findOneAndUpdate(
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
      if (!deletedProduct) {
        throw new Error('Wishlist not found');
      }

      return deletedProduct;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = WishlistService;
