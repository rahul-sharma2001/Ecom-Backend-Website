const express = require('express');
const router = express.Router();
const userRoutes = require('./user');
const orderRoutes = require('./order');

router.use('/user', userRoutes);
router.use('/order', orderRoutes);


module.exports = router;
