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
    let orderList = await orderServiceInstance.getOrders(queryObject);
    if (orderList) {
      res.status(200).json(
        {
          message:"Order Fetched Successfully",
          count:orderList.length,
          details:orderList
        }
      );
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
const filterOrder = async (req,res)=>{
  try{
  
    let queryObject = req.query;
    let filteredOrder = await orderServiceInstance.filterOrder(queryObject);
    if(filteredOrder){
      res.status(200).json({
        message:"Orders filtered Successfully",
        count:filteredOrder.length,
        details :filteredOrder
      })
    }
    else{
      res.status(404).send("Filter is invalid");
    }
  }
  catch(err){
    res.status(500).send("Server Error Cannot filter order");
    throw err;
  }
}
const searchOrder= async(req,res)=>{
  try{
    let queryObject= {
      search : req.query.search,
      userId : req.params.userId,
      limit: req.query.limit,
      offset: req.query.offset
    }
    let queryResult = await orderServiceInstance.searchOrder(queryObject);
    if(queryResult )
    {
      res.status(200).json({
        message:"Orders filtered Successfully",
        count:queryResult.length,
        details :queryResult
      })
    }else{
      res.status(404).send("No orders found for specific search");
    }
  }
  catch(err){
    res.status(500).send("Server Error Cannot filter order");
    throw err;
  }
}
const getOrderById=async (req,res)=>{
  try{
    let order = await orderServiceInstance.getOrderById(req.params);
    if(order){
      res.status(200).json({
        message:"Order Fetched Successfully",
        count:order.length,
        details: order
      })
    }
    else{
      res.status(404).send("Order does not exist");
    }

  }
  catch(err){
    res.status(500).send("Server Error Cannot get Order")
  }
  

}

module.exports = { getOrder, updateOrder, addOrder, deleteOrder ,filterOrder,searchOrder,getOrderById};
