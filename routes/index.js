const express = require('express');
const router = express.Router();
const userRoutes = require('./user');
const productRoutes = require('./product')

router.use('/user', userRoutes);
router.use('/product', productRoutes);

module.exports = router;
