const userModel = require('../model/user');

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
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserService;
