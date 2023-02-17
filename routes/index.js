const express = require('express');
const router = express.Router();
const userRoutes = require('./user');
const sellerRoutes = require('./seller');

// const {getAllTasks,createTask,updateTask,deleteTask,getTask}=require('../controllers/tasks')//importing getAllTasks
router.use('/user', userRoutes);
router.use('/seller', sellerRoutes);
module.exports = router;
