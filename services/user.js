const userModel = require('../model/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
class UserService {
  
  async createUser(userInfo) {
    try {
      if (!userInfo) {
        throw new Error('User details is required');
      }
      const savedUser = await userModel.create(userInfo);
      return savedUser;
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
  
          return {
            status: true,
            message: 'login successfull!',
            token: jwtToken
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
}

module.exports = UserService;
