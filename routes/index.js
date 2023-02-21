const express=require('express')
const router=express.Router()
const userRoutes = require('./user');
const categoryRoutes = require('./category')

// const {getAllTasks,createTask,updateTask,deleteTask,getTask}=require('../controllers/tasks')//importing getAllTasks
router.use('/user', userRoutes);
router.use('/category', categoryRoutes)

module.exports= router