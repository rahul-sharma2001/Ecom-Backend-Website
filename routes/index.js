const express = require('express');
const router = express.Router();
const userRoutes = require('./user');
const sellerRoutes = require('./seller');
const productRoutes = require('./product');
const addressRoutes = require('./address');
const orderRoutes = require('./order');
const reviewRoutes = require('./review');
const cartRoutes = require('./cart');

router.use('/user', userRoutes);
router.use('/seller', sellerRoutes);
router.use('/review', reviewRoutes);
router.use('/product', productRoutes);
router.use('/order', orderRoutes);
router.use('/cart', cartRoutes);
router.use('/address', addressRoutes);

module.exports = router;
