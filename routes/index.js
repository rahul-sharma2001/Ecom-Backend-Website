const express=require('express')
const router=express.Router()
const userRoutes = require('./user');

// const {getAllTasks,createTask,updateTask,deleteTask,getTask}=require('../controllers/tasks')//importing getAllTasks
router.use('/user', userRoutes);

module.exports= router