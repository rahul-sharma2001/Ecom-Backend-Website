const orderModel = require('../model/order');

class OrderService {
  async createOrder(orderInfo) {
    try {
      if (!orderInfo) {
        throw new error('Order Information Required to create Order');
      }
      const newOrder = await new orderModel(orderInfo);
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
      .find({ 'user.userId': userId })
      .skip(offset)
      .limit(limit);

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
  async filteredOrder(filter) {
    try {
      if ('status' in filter || '_Id' in filter || 'paymentId' in filter) {
        let filteredOrder = await orderModel.find(filter).skip(0).limit(20);
        return filteredOrder;
      } else if ('userId' in filter) {
        let filteredOrder = await orderModel
          .find({ 'user.userId': filter.userId })
          .skip(0)
          .limit(20);
        return filteredOrder;
      } else if ('sellerId' in filter) {
        let filteredOrder = await orderModel
          .aggregate([
            { $unwind: '$products' },
            { $match: { 'products.sellerId': filter.sellerId } },
            { $project: { products: 1 } }
          ])
          .skip(0)
          .limit(20);
        return filteredOrder;
      } else {
        let filteredOrder = await orderModel.find({}).skip(0).limit(20);
        return filteredOrder;
      }
    } catch (err) {
      throw err;
    }
  }
}
module.exports = OrderService;
