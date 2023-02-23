const { response } = require('express');
const orderModel = require('../model/order');
const OrderService = require('../services/order');
const orderServiceInstance = new OrderService();

const getOrder = async (req, res) => {
  try {
    let queryObject = {
      userId: req.params.userId,
      offset: req.query.offset,
      limit: req.query.limit,
      filter: req.query.filter
    };

    let orderlist = await orderServiceInstance.getOrders(queryObject);

    if (orderlist) {
      res.status(200).json(orderlist);
    } else {
      res
        .status(404)
        .json(
          'Either user Does not exists or filter is Invalid or offset or limit is negative'
        );
    }
  } catch (err) {
    res.status(500).send('Server Error');
    throw err;
  }
};
const addOrder = async (req, res) => {
  try {
    const newOrder = await orderServiceInstance.createOrder(req.body);

    if (newOrder) {
      res.status(200).json({
        message: 'order added successfully',
        details: newOrder
      });
    } else {
      res.status(400).send('Order cannot be added');
    }
  } catch (err) {
    res.status(500).send('Server Error cannot add order');
    throw err;
  }
};
const updateOrder = async (req, res) => {
  try {
    let updatedOrder = await orderServiceInstance.updateOrder(req.body);

    if (updatedOrder) {
      res.status(200).json({
        message: 'Order has been updated Successfully',
        details: updatedOrder
      });
    } else {
      res.status(404).send('Order does not exist');
    }
  } catch (err) {
    res.status(500).send('Server error cannot update Order');
    throw err;
  }
};
const deleteOrder = async (req, res) => {
  try {
    let deletedOrder = await orderServiceInstance.deleteOrder(req.body);
    if (deletedOrder) {
      res.status(200).json({
        message: 'Order has been deleted successfully',
        details: deletedOrder
      });
    } else {
      res.status(404).send('Order Does not exist');
    }
  } catch (err) {
    res.status(500).send('Server error cannot delete error');
    throw err;
  }
};

module.exports = { getOrder, updateOrder, addOrder, deleteOrder };
