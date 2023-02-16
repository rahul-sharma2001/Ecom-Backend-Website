const express = require('express');
const {
    getCart,
    createCart,
    deleteCart,
    updateCart
} = require('../controllers/cart');
const router = express.Router();

router.post('/', createCart)
router.get('/:userId', getCart)
router.delete('/:userId', deleteCart)
router.patch('/:userId/:productId/:variantId', updateCart)

// --> remaining api = delete one product from cart


module.exports = router;
