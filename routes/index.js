const express = require('express');
const router = express.Router();
const userRoutes = require('./user');
const categoryRoutes = require('./category');
const reviewRoutes = require('./review');
const addressRoutes = require('./address');
const productRoutes = require('./product');
const passwordRoutes = require('./password');
const orderRoutes = require('./order');
const cartRoutes = require('./cart');
const imageUpload = require('./imageUpload');
const wishlist = require('./wishlist');

router.use('/user', userRoutes);
router.use('/category', categoryRoutes);
router.use('/password', passwordRoutes);
router.use('/review', reviewRoutes);
router.use('/product', productRoutes);
router.use('/order', orderRoutes);
router.use('/cart', cartRoutes);
router.use('/address', addressRoutes);
router.use('/imageUpload', imageUpload);
router.use('/wishlist', wishlist);

module.exports = router;
