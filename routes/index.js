const express = require('express');
const router = express.Router();
const userRoutes = require('./user');
const reviewRoutes = require('./review')
const productRoutes = require('./product')
const orderRoutes = require('./order');

router.use('/user', userRoutes);
router.use('/review', reviewRoutes);
router.use('/product', productRoutes);
router.use('/order', orderRoutes);

module.exports = router;
