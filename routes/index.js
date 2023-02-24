const express = require('express');
const router = express.Router();
const userRoutes = require('./user');
const cartRoutes = require('./cart');
const productRoutes = require('./product')
const orderRoutes = require('./order');

router.use('/user', userRoutes);
router.use('/product', productRoutes);
router.use('/order', orderRoutes);
router.use('/cart', cartRoutes);

module.exports = router;
