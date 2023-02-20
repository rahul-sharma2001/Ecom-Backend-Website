const userModel = require('../model/user');
// const findUser = async(userId)=>{
//         return await userModel.findOne({ _id: userId });
//      }
// const updateuser=async(userId)=>{
// await userModel.findOneAndUpdate({_id:userId},req.body,{
//     new:true,
//     runValidators:true,
//   })
// }

// const userServiceInstance = new UserService(userModel);
// const seller = new UserService(sellerModel)

class UserService {
  // constructor(model) {
  //   this.model = model;
  // }

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

      const savedUser = await userModel.findOne(id);
      if (savedUser) {
        return savedUser;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  }
  async updateUser({ _id: userId }) {
    try {
      if (!{ _id: userId }) {
        throw new Error('User details is required');
      }

      const savedUser = await userModel.findOneAndUpdate({ _id: userId });
      if (savedUser) {
        return savedUser;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  }
  async deleteUser({ _id: userId }) {
    try {
      if (!{ _id: userId }) {
        throw new Error('User details is required');
      }

      const savedUser = await userModel.findOneAndDelete({ _id: userId });

      if (!savedUser) {
        throw new Error('user not deleted');
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserService;
