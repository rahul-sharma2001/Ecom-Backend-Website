const express=require('express')
const router=express.Router()
const userRoutes = require('./user');
const cartRoutes = require('./cart');

router.use('/user', userRoutes);
router.use('/cart', cartRoutes);

module.exports= router