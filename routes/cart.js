const express = require('express');
const {
  getCart,
  createCart,
  deleteCart,
  updateQtyInCart,
  deleteProduct,
  addProduct,
  createTemporaryUserId,
  handleBuyNow
} = require('../controllers/cart');
const router = express.Router();

router.post('/', createCart);
router.get('/:userId', getCart);
router.delete('/:userId', deleteCart);
router.patch('/:userId/:productId/:variantId', updateQtyInCart);
router.delete('/:userId/:productId/:variantId', deleteProduct);
router.patch('/:userId', addProduct);
router.post('/guest', createTemporaryUserId);
router.get('/handleBuyNow/:userId/:tempId', handleBuyNow);

module.exports = router;
