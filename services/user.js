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
      const getUser = await userModel.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(id) } },
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
        },
        {
          $project: {
            password: 0
          }
        }
      ]);

      if (!getUser.length) {
        throw new Error(`No user with id: ${id}`);
      }
      const userData = getUser[0];
      return userData;
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
      const { role, search } = body;
      const conditions = [];
      if (search) {
        conditions.push(
          { emailId: { $regex: new RegExp(`^${search}`, 'i') } },
          { contactNumber: { $regex: new RegExp(`^${search}`, 'i') } }
        );
      }
      const pipeline = [];
      if (role) {
        pipeline.push({
          $match: {
            role: { $regex: `^${role}` }
          }
        });
      }
      if (conditions.length > 0) {
        pipeline.push({
          $match: {
            $or: conditions
          }
        });
      }
      pipeline.push(
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
      );
      const page = Number(body.page) || 1;
      const limit = Number(body.limit) || 10;
      const skip = (page - 1) * limit;
      let allUsers = await userModel.aggregate(pipeline);
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
