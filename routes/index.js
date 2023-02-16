const express=require('express')
const router=express.Router()
const userRoutes = require('./user');
const cartRoutes = require('./cart');
const variantRoutes = require('./variant')

// const {getAllTasks,createTask,updateTask,deleteTask,getTask}=require('../controllers/tasks')//importing getAllTasks
router.use('/user', userRoutes);
router.use('/cart', cartRoutes);
router.use('/variant', variantRoutes);

module.exports= router