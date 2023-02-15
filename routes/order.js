const express = require('express');
const router = express.Router();

const userModel = require('../model/order');
const controllers = require('../controllers/order');

router.get('/getOrder/:userId',controllers.getOrder);
router.post('/addOrder', controllers.addOrder);
router.patch('/updateOrder',controllers.updateOrder);
router.delete('/deleteOrder',controllers.deleteOrder);

module.exports = router;
