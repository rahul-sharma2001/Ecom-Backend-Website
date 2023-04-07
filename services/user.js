const sellerModel = require('../model/seller');
const userModel = require('../model/user');
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  auth: {
    user: '19ceusf036@ddu.ac.in',
    pass: 'jaan1234'
  }
});
class UserService {
  async createUser(userInfo) {
    const { password } = userInfo;
    const hashedPassword = await bcrypt.hash(userInfo.password, 10);
    userInfo.password = hashedPassword;
    console.log(userInfo.password, hashedPassword, 'new');
    try {
      console.log(userInfo, 'userinfo');
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
          const token = jwt.sign(
            { sellerId: savedUser._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' }
          );
          const resetUrl = `http://localhost:3000/set-password/${token}`;
          const mailOptions = {
            from: '19ceusf036@ddu.ac.in',
            to: userInfo.emailId,
            subject: ' set password',
            html: `<p>hiii ${userInfo.firstName} ,</p><br><b>OTP:${password}</b><br><p>Please click the following link to set your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`
          };
          await transporter.sendMail(mailOptions);
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

  async login(loginData) {
    try {
      if (!loginData) {
        throw new Error('User details is required');
      }
      const LoginUser = await userModel.findOne({ emailId: loginData.emailId });
      let modifiedObject = LoginUser;

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
          modifiedObject.password = null;
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

      console.log(LoginUser)
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
        console.log(matchPassword);
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

      if ('seller'.match(`^${role}`)) {
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
      }

      pipeline.push({
        $project: {
          password: 0
        }
      });

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

  async getupdatedId({ userId, cartProductsInTempId }) {
    console.log(userId, cartProductsInTempId);

    if (!userId || !cartProductsInTempId) {
      throw new Error('Required fields = userId, cartProductsInTempId');
    }

    const updatedData = await userModel.findOneAndUpdate(
       {_id:userId} ,
      { $set: {  cartProductsInTempId } },
      { new: true, runValidators: true } 
    );
    return updatedData;
  }
}

module.exports = UserService;
