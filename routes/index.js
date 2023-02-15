const express=require('express')
const router=express.Router()
const userRoutes = require('./user');
const orderRoutes = require('./order');

// const {getAllTasks,createTask,updateTask,deleteTask,getTask}=require('../controllers/tasks')//importing getAllTasks
router.use('/user', userRoutes);
router.use('/order', orderRoutes);


module.exports= router