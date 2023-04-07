const express = require('express');

const {
  createWishlist,
  getWishlist,
  deleteWishlist,
  addProduct,
  deleteProduct
} = require('../controllers/wishlist');
const router = express.Router();

router.post('/', createWishlist);
router.get('/:userId', getWishlist);
router.delete('/:userId', deleteWishlist);
router.delete('/:userId/:productId', deleteProduct);
router.patch('/:userId', addProduct);

module.exports = router;
