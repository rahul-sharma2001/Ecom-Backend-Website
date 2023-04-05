const orderModel = require('../model/order');
const moment = require('moment/moment');
const counterModel = require('../model/counters');
const config = require('../constants/config');
const mongoose = require('mongoose');
let padderObj = new ZeroPadder(5);

class OrderService {
  async createOrder(orderInfo) {
    try {
      if (!orderInfo) {
        throw new error('Order Information Required to create Order');
      }
      let idDigits = await this.getCounter();
      let systemGeneratedId =
        'BBOR' + moment().format('YYYYMM') + padderObj.pad(idDigits);
      let finalObject = { ...orderInfo, _Id: systemGeneratedId };
      const newOrder = await new orderModel(finalObject);
      const savedOrder = await newOrder.save();
      return savedOrder;
    } catch (err) {
      throw err;
    }
  }

  async getOrders(queryObject) {
    const { userId, offset = 0, limit = 20, filter } = queryObject;

    if (!userId) {
      throw new Error('User Id Must required');
    }
    if (offset < 0 || limit < 0) {
      return null;
    }
    try {
      if(!filter){
        const orderList = await orderModel
        .find({$and:[{ 'user.userId': userId },{status:{$ne:'deleted'}}]})
        .skip(offset)
        .limit(limit)
        
        return orderList
      }
        if (filter === 'Last30') {
          let currentDate = moment().format("MM/DD/YYYY")
          let dateOlderThan30Days = moment().subtract(30,'days').calendar()
          const orderList = await orderModel.find({$and:[{'user.userId':userId},{status:{$ne:'deleted'}},{$and:[{orderDate:{$gte:dateOlderThan30Days}},{orderDate:{$lte:currentDate}}]}]}).skip(offset).limit(limit)
          return orderList
        }
        if (filter === 'Older'){
          const orderList = await orderModel.find({$and:[{'user.userId':userId},{status:{$ne:'deleted'}},{orderDate:{$lt:'2020'}}]}).skip(offset).limit(limit);
          return orderList;
        }
        if (filter === '2023' || filter === '2022' || filter === '2021' || filter === '2020'){
          const orderList = await orderModel.find({$and:[{'user.userId':userId},{status:{$ne:'deleted'}},{orderDate:{$gte:filter+'-01-01T00:00:00.00+00:00',$lte:filter+'-12-31T23:59:59.00+00:00'}}]}).skip(offset).limit(limit);
          return orderList;
        }
      } catch (err) {
        throw err;
      } 
  }

  async updateOrder(order) {
    try {
      let { status, orderDate, deliveryDate,_Id } = order;
      let updatedOrder = await orderModel.findOneAndUpdate(
        { _Id: _Id },
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
      return updatedOrder;
    } catch (err) {
      throw err;
    }
  }
  async deleteOrder({orderId}) {
    try {
      let deletedOrder = await orderModel.findOneAndDelete({ _Id: orderId });
      return deletedOrder;
    } catch (err) {
      throw err;
    }
  }
  async filterOrder(queryObject) {

    let filterObj = {};
    const pipeline = [];
    let {
      userId,
      _Id,
      paymentId,
      status,
      sellerId,
      limit = 20,
      offset = 0
    } = queryObject;
    limit = (+limit)
    offset = (+offset)
    if (userId) {
      filterObj['user.userId'] =mongoose.Types.ObjectId(userId);
    }
    if (_Id) {
      filterObj['_Id'] = _Id;
    }
    if (paymentId) {
      filterObj['paymentId'] = mongoose.Types.ObjectId(paymentId)
    }
    if (status) {
      filterObj['status'] = status;
    }
    if (sellerId) {
      filterObj['products.sellerId'] =sellerId

      pipeline.push({
        $unwind: { path: '$products' }
      });

      pipeline.push({
        $project: { totalAmount: 0 }
      });
    }

    pipeline.push({
      $match: filterObj
    });

    if(filterObj.status !== 'deleted'){
      pipeline.push({
        $match: {status:{$ne:'deleted'}}
      });
    }
 

    let filterOrder = await orderModel
      .aggregate(pipeline)
      .skip(offset)
      .limit(limit);
    return filterOrder;
  }
  async getCounter() {
    try {
      let counterObj = await counterModel.findOneAndUpdate(
        { _id: config.COUNTER_RECORD_ID },
        {
          $inc: { orderIdCounter: 1 },
          new: true
        }
      );
      return counterObj.orderIdCounter;
    } catch (err) {
      throw err;
    }
  }
  async searchOrder(queryObject){
    let {userId,search,limit=20,offset=0}= queryObject;
    try{
      let searchedOrders = await orderModel.find({$and:[{'user.userId':userId},{'products.name':
        {$regex:search,$options:'i'}
      }]}).skip(offset).limit(limit);
      return searchedOrders;
    }
    catch(err){
      throw(err)
    }
  }
  async getOrderById({orderId}){
    if(!orderId){
      throw new Error("order Id must be required");
    }
    try{
      let order = await orderModel.find({_Id:orderId});
      return order

    }
    catch(err){
      throw (err);
    }
  }
}
function ZeroPadder(len, pad) {
  if (len === undefined) {
    len = 1;
  } else if (pad === undefined) {
    pad = '0';
  }
  var pads = '';
  while (pads.length < len) {
    pads += pad;
  }
  this.pad = function (what) {
    var s = what.toString();
    return pads.substring(0, pads.length - s.length) + s;
  };
}
module.exports = OrderService;
