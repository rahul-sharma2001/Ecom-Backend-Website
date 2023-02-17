const express = require('express');
const router = express.Router();

const controllers = require('../controllers/order');

router.get('/getOrder/:userId', controllers.getOrder);
router.post('/addOrder', controllers.addOrder);
router.patch('/updateOrder', controllers.updateOrder);
router.delete('/deleteOrder', controllers.deleteOrder);
router.get('/filterOrder/:userId', controllers.filterOrder);
module.exports = router;
