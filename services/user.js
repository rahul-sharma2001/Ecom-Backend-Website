const sellerModel = require('../model/seller');
const userModel = require('../model/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class UserService {
  async createUser(userInfo) {
    try {
      if (!userInfo) {
        throw new Error('User details is required');
      }

      const hashedPassword = await bcrypt.hash(userInfo.password, 10);
      userInfo.password = hashedPassword;

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
              contactNumber: `${userInfo.address.contactNumber}`,
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
        throw new Error('only user or seller or admin can be created');
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

  async login(loginData) {
    try {
      if (!loginData) {
        throw new Error('User details is required');
      }
      const LoginUser = await userModel.findOne({ emailId: loginData.emailId });
      if (!LoginUser) {
        return {
          status: false,
          message: 'invalid emailId or password'
        };
      } else {
        const matchPassword = await bcrypt.compare(
          loginData.password,
          LoginUser.password
        );

        if (!matchPassword) {
          return {
            status: false,
            message: 'invalid emailId or password'
          };
        } else {
          const jwtToken = jwt.sign(
            { id: LoginUser._id },
            process.env.JWT_SECRET_KEY
          );

          LoginUser.password = null;

          return {
            status: true,
            message: 'login successfull!',
            token: jwtToken,
            userData: LoginUser
          };
        }
      }
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
      const savedUser = await userModel.find(userQuery).select('-password');

      if (savedUser) {
        return savedUser;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserService;
