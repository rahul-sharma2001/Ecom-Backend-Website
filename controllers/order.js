const orderModel = require('../model/order');
const orderService = require('../services/order');
const orderServiceInstance = new orderService();


module.exports = {
  
  getOrder: async (req, res) => {
    try {
      let orderlist = await orderServiceInstance.getOrders(req.params.userId);

      if (orderlist) {
        res.status(200).json(orderlist);
      } else {
        res.status(404).json('User Does not exists');
      }
    } catch (err) {
      res.status(500).send('Server Error');
      throw err;
    }
  },
  addOrder:async (req, res) => {
    try{
    const newOrder = await orderServiceInstance.createOrder(req.body);
   
    if(newOrder){
      res.status(200).json({
        message: 'order added successfully',
        details:newOrder,
      });

    }
    else{
      res.status(400).send("Order cannot be added");
    }
  
   }
   catch(err){
      res.status(500).send("Server Error cannot add order");
      throw err;
   }
  },
  updateOrder: async (req,res)=>{
    try{
   
    let updatedOrder = await orderServiceInstance.updateOrder(req.body);

  
    if(updatedOrder){
      console.log(updatedOrder);
      res.status(200).json({
        message:"Order has been updated Successfully",
        details :updatedOrder
      })
    }
    else{
      res.status(404).send("Order does not exist");
    }
  }
  
  catch(err){
    res.status(500).send("Server error cannot update Order");
   throw err;
  }

  },
  deleteOrder:async (req,res)=>{
    try{
      console.log(req.body._Id)
    let deletedOrder = await orderServiceInstance.deleteOrder(req.body);
    if(deletedOrder){
      console.log(deletedOrder);
      res.status(200).json({
        message:"Order has been deleted successfully",
        details:deletedOrder
      })
    }
    else{
      res.status(404).send("Order Does not exist");
    }
  }
  catch(err){
    res.status(500).send("Server error cannot delete error");
    throw err;
  }


  }


};
