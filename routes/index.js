const express=require('express')
const router=express.Router()
const userRoutes = require('./user');
const productRoutes = require('./product')

// const {getAllTasks,createTask,updateTask,deleteTask,getTask}=require('../controllers/tasks')//importing getAllTasks
router.use('/user', userRoutes);
router.use('/product', productRoutes);

module.exports= router