const express = require('express');
const router = express.Router();
const userRoutes = require('./user');
const reviewRoutes = require('./review')
const cartRoutes = require('./cart');
const addressRoutes = require('./address')
const productRoutes = require('./product')
const orderRoutes = require('./order');

router.use('/user', userRoutes);
router.use('/review', reviewRoutes);
router.use('/product', productRoutes);
router.use('/order', orderRoutes);
router.use('/cart', cartRoutes);
router.use('/address', addressRoutes )

module.exports = router;
