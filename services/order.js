const orderModel = require('../model/order');
const moment = require('moment');
class OrderService {
  async createOrder(orderInfo) {
    try {
      if (!orderInfo) {
        throw new error('Order Information Required to create Order');
      }
      const newOrder = await new orderModel(orderInfo);
      const savedOrder = await newOrder.save();
      if (savedOrder) {
        return savedOrder;
      } else {
        return null;
      }
    } catch (err) {
      throw err;
    }
  }

  async getOrders(queryObject) {
    const { userId, offset = 0, limit = 20 } = queryObject;

    if (!userId) {
      throw new Error('User Id Must required');
    }
    if (offset < 0 && limit < 0) {
      throw new Error('Limit and offset must be positive integers');
    }

    try {
      const orderList = await orderModel
        .find({ 'user.userId': userId })
        .skip(offset)
        .limit(limit);

      if (orderList.length !== 0) {
        return orderList;
      } else {
        return null;
      }
    } catch (err) {
      throw new Error('Could not get Orders');
    }
  }


  async updateOrder(order) {
    try {
      let { status, orderDate, deliveryDate } = order;
      let updatedOrder = await orderModel.findOneAndUpdate(
        { _Id: order._Id },
        {
          $set: {
            status,
            orderDate,
            deliveryDate
          }
        },
        {
          new: true
        }
      );
      if (updatedOrder != null) {
        return updatedOrder;
      } else {
        throw new Error('Could not update order');
      }
    } catch (err) {
      throw err;
    }
  }
  async deleteOrder(order) {
    try {
      let deletedOrder = await orderModel.findOneAndDelete({ _Id: order._Id });
      if (deletedOrder != null) {
        return deletedOrder;
      } else {
        throw new Error('Could not delete order');
      }
    } catch (err) {
      throw err;
    }
  }

  async filterOrder(filterObj) {
    let { filter, userId } = filterObj;

    try{
    if (!userId) {
      throw new Error('User Id Must required');
    }
    let orderList = await orderModel.find({ 'user.userId': userId });
    
    if(!filter){
      return orderList;
    }

    if (filter === 'Last30') {
      let filteredOrders = orderList.filter(order => {
        const diff = moment().diff(order.orderDate, 'day');

        return diff <= 30;
      });
      return filteredOrders;
    }
    else if (filter === 'Older') {
      let filteredOrders = orderList.filter(order => {
        let orderDateYear = moment(order.orderDate).format('YYYY');
        if (orderDateYear < 2020) {
          return order;
        }
      });
      return filteredOrders;
    }
    else if (
      filter === '2023' ||
      filter === '2022' ||
      filter === '2021' ||
      filter === '2020'
    ) {
      let filteredOrder = orderList.filter(order => {
        let orderDateYear = moment(order.orderDate).format('YYYY');
        if (orderDateYear === filter) {
          return order;
        }
      });
      return filteredOrder;
    }
    else{
      return null;
    }
  }catch(err){
    throw err;
  }
  }
  
}
module.exports = OrderService;
