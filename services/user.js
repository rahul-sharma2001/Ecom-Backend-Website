const sellerModel = require('../model/seller');
const userModel = require('../model/user');
const mongoose = require('mongoose');

class UserService {
  async createUser(userInfo) {
    try {
      const session = await mongoose.startSession();
      session.startTransaction();

      if (!userInfo) {
        throw new Error('User details is required');
      }

      if (userInfo.role === 'user' || userInfo.role === 'admin') {
        const savedUser = await userModel.create(userInfo);
        return savedUser;
      } else if (userInfo.role === 'seller') {
        if (userInfo.address && userInfo.companyName) {
          const savedUser = await userModel.create(userInfo);
          const newSeller = {
            sellerId: savedUser._id,
            address: {
              addressType: `${userInfo.address.addressType}`,
              name: `${userInfo.address.name}`,
              phoneNumber: `${userInfo.address.phoneNumber}`,
              pincode: `${userInfo.address.pincode}`,
              street: `${userInfo.address.street}`,
              locality: `${userInfo.address.locality}`,
              city: `${userInfo.address.city}`,
              state: `${userInfo.address.state}`,
              country: `${userInfo.address.country}`
            },
            companyName: userInfo.companyName
          };

          const savedSeller = await sellerModel.create(newSeller);
          return savedSeller;
        } else {
          throw new Error('Address and Company Name Required');
        }
      } else {
        throw new Error('no user with this role');
      }
    } catch (error) {
      throw error;
    }
  }
  async getUser(id) {
    try {
      if (!id) {
        throw new Error('User details is required');
      }

      const getUser = await userModel.findOne(id).select('-password');
      return getUser;
    } catch (error) {
      throw error;
    }
  }
  async updateUser(id, update, opts) {
    try {
      if (!id) {
        throw new Error('User details is required');
      }
      const updatedUser = await userModel.findOneAndUpdate(id, update, opts);
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }
  async deleteUser(id) {
    try {
      if (!id) {
        throw new Error('User details is required');
      }

      const deletedUser = await userModel.findOneAndDelete(id);

      if (!deletedUser) {
        throw new Error('user not deleted');
      }
    } catch (error) {
      throw error;
    }
  }
  async getLoginUser(id) {
    try {
      if (!id) {
        throw new Error('User details is required');
      }

      const getLoginUser = await userModel.findOne(id);
      return getLoginUser;
    } catch (error) {
      throw error;
    }
  }
  async getFilteredUsers(body) {
    try {
      if (!body) {
        throw new Error('User details is required');
      }
      const { role, emailId, contactNumber } = body;

      const userQuery = {};

      if (role) {
        userQuery['role'] = { $regex: `^${role}` };
      }
      if (emailId) {
        userQuery['emailId'] = { $regex: `^${emailId}` };
      }
      if (contactNumber) {
        userQuery['contactNumber'] = { $regex: `^${contactNumber}` };
      }

      const page = Number(body.page) || 1;
      const limit = Number(body.limit) || 10;
      const skip = (page - 1) * limit;

      let allUsers = await userModel.aggregate([
        {
          $match: userQuery
        },
        {
          $lookup: {
            from: 'sellers',
            localField: '_id',
            foreignField: 'sellerId',
            as: 'sellerAdditionalData'
          }
        },
        {
          $unwind: {
            path: '$sellerAdditionalData',
            preserveNullAndEmptyArrays: true
          }
        }
      ]);

      const count = allUsers.length;
      const filteredUsers = allUsers.slice(skip, skip + limit);

      if (filteredUsers) {
        return { count, filteredUsers };
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserService;
