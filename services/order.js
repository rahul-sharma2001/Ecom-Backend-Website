const orderModel = require('../model/order');
const moment = require('moment/moment');
const counterModel = require('../model/counters');
const config = require('../constants/config');
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
    const orderList = await orderModel
      .find({$and:[{ 'user.userId': userId },{status:{$ne:'deleted'}}]})
      .skip(offset)
      .limit(limit)

    if (!filter) {
      try {
        if (orderList.length != 0) {
          return orderList;
        }
      } catch (err) {
        throw new Error('Could not get Orders');
      }
    } else {
      try {
        if (orderList.length == 0) {
          return null;
        }

        if (filter === 'Last30') {
          let filteredOrders = orderList.filter(order => {
            const diff = moment().diff(order.orderDate, 'day');
            return diff <= 30;
          });
          return filteredOrders;
        } else if (filter === 'Older') {
          let filteredOrders = orderList.filter(order => {
            let orderDateYear = moment(order.orderDate).format('YYYY');
            if (orderDateYear < 2020) {
              return order;
            }
          });
          return filteredOrders;
        } else if (
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
        } else {
          return null;
        }
      } catch (err) {
        throw err;
      }
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
      return updatedOrder;
    } catch (err) {
      throw err;
    }
  }
  async deleteOrder(order) {
    try {
      let deletedOrder = await orderModel.findOneAndDelete({ _Id: order._Id });
      return deletedOrder;
    } catch (err) {
      throw err;
    }
  }
  async filterOrder(queryObject) {
    // let { filter, limit = 20, offset = 0 } = queryObject;

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
      filterObj['user.userId'] = userId;
    }
    if (_Id) {
      filterObj['_Id'] = _Id;
    }
    if (paymentId) {
      filterObj['paymentId'] = paymentId;
    }
    if (status) {
      filterObj['status'] = status;
    }
    if (sellerId) {
      filterObj['products.sellerId'] = sellerId;

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
