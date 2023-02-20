const userModel = require('../model/user');

class UserService {
  async createUser(userInfo) {
    try {
      if (!userInfo) {
        throw new Error('User details is required');
      }

      const savedUser = await userModel.create(userInfo);

      if (savedUser) {
        return savedUser;
      } else {
        return null;
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

      const savedUser = await userModel.findOne(id).select('-password');

      if (savedUser) {
        return savedUser;
      } else {
        return null;
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

      const savedUser = await userModel.findOneAndUpdate(id, update, opts);
      if (savedUser) {
        return savedUser;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  }
  async deleteUser(id) {
    try {
      if (!id) {
        throw new Error('User details is required');
      }

      const savedUser = await userModel.findOneAndDelete(id);

      if (savedUser) {
        return savedUser;
      } else {
        return null;
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
}

module.exports = UserService;
