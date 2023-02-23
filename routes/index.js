const express = require('express');
const router = express.Router();
const userRoutes = require('./user');
const addressRoutes = require('./address')

router.use('/user', userRoutes);
router.use('/address', addressRoutes )

module.exports = router;
