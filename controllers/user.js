const UserService = require('../services/user');
const userModel = require('../model/user');
let userService = new UserService();

const createUser = async (req, res) => {
  const user = req.body;
  try {
    let adduser = await userService.createUser(user);
    res
      .status(200)
      .json({ status: true, message: 'user created successfully!' });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const user = await userService.getUser({ _id: userId });
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: `no user with id: ${userId}` });
    }
    res.status(200).json({ status: true, user });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const user = await userService.updateUser({ _id: userId }, req.body, {
      new: true,
      runValidators: true
    });
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: `no user with id: ${userId}` });
    }
    res
      .status(200)
      .json({ status: true, message: 'user updated successfully!' });
  } catch (error) {
    res.status(500).json({ status: false, messagesg: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const user = await userService.deleteUser({ _id: userId });
    res
      .status(200)
      .json({ status: true, message: 'user deleted successfully!' });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  createUser,
  getUser,
  deleteUser,
  updateUser
};
