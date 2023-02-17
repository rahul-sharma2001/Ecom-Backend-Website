const express=require('express')
const router=express.Router()
const userRoutes = require('./user');
const reviewRoutes = require('./review')

// const {getAllTasks,createTask,updateTask,deleteTask,getTask}=require('../controllers/tasks')//importing getAllTasks
router.use('/user', userRoutes);
router.use('/review', reviewRoutes);

module.exports= router