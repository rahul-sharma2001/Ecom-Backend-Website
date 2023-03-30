const sellerModel = require('../model/seller');
const userModel = require('../model/user');
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');


let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  auth: {
      user: '19ceusf036@ddu.ac.in',
      pass: 'jaan1234'
  }
});
class UserService {
  async createUser(userInfo) {
    try {
      console.log(userInfo)
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
          const token = jwt.sign({ sellerId: savedUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
          const resetUrl = `http://localhost:3000/reset-password/${token}`;
          const mailOptions = {
            from: '19ceusf036@ddu.ac.in',
            to: userInfo.emailId,
            subject: ' Password Reset',
            html: `<p>Please click the following link to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`
          };
          await transporter.sendMail(mailOptions);
          return savedSeller;
        } else {
          throw new Error('Address and Company Name Required');
        }
      } 
      else {
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

  async login(loginData){
    try {
      if (!loginData) {
        throw new Error('User details is required');
      }
      const LoginUser = await userModel.findOne({emailId:loginData.emailId});
      let modifiedObject = LoginUser

      if (!LoginUser) {
        return{
          status: false,
          message: 'invalid emailId or password'
        };
      } else {
        const matchPassword = await bcrypt.compare(
          loginData.password,
          LoginUser.password
        );
        
        if (!matchPassword) {
          return{
            status: false,
            message: 'invalid emailId or password'
          };
        } else {
          const jwtToken = jwt.sign(
            { id: LoginUser._id },
            process.env.JWT_SECRET_KEY
          );
          modifiedObject.password = null
          return {
            status: true,
            message: 'login successfull!',
            token: jwtToken,
            userData: modifiedObject
          };
        }
      }
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
