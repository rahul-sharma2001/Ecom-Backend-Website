const sellerModel = require('../model/seller');

class SellerService {
  async createSeller(sellerInfo) {
    try {
      if (!sellerInfo) {
        throw new Error('User details is required');
      }

      const savedUser = await sellerModel.create(sellerInfo);

      if (savedUser) {
        return savedUser;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  }
  async getSeller(id) {
    try {
      if (!id) {
        throw new Error('User details is required');
      }

      const savedUser = await sellerModel.findOne(id).select('-password');

      if (savedUser) {
        return savedUser;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  }
  async updateSeller(id, update, opts) {
    try {
      if (!id) {
        throw new Error('User details is required');
      }

      const savedUser = await sellerModel.findOneAndUpdate(id, update, opts);
      if (savedUser) {
        return savedUser;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  }
  async deleteSeller(id) {
    try {
      if (!id) {
        throw new Error('User details is required');
      }

      const savedUser = await sellerModel.findOneAndDelete(id);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = SellerService;
