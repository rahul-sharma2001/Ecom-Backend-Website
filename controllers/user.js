const UserService = require('../services/user');
const userModel = require('../model/user');
let userServiceInstance = new UserService();
const createUser = async (req, res) => {
  const user = req.body;
  try {
    let adduser = await userServiceInstance.createUser(user);
    res
      .status(200)
      .json({ status: true, message: 'user created successfully!' });
  } catch (error) {
    res.status(500).json({ status: false, message: `error == ${error}` });
    console.log(error);
  }
};

const getUser = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const user = await userServiceInstance.getUser({ _id: userId });
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: `no user with id: ${userId}` });
    }
    res.status(200).json({ status: true, user });
  } catch (error) {
    console.log('error===', error);
    res
      .status(500)
      .json({ status: false, message: `error ingetUser== ${error}` });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const user = await userServiceInstance.updateUser(
      { _id: userId },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    if (!user) {
      return res.status(404).json({ msg: `no task with id: ${userId}` });
    }
    res
      .status(200)
      .json({ status: true, message: 'user updated successfully!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const user = await userServiceInstance.deleteUser({ _id: userId });
    if (!user) {
      return res.status(404).json({ msg: `no user with id: ${userId}` });
    }
    res
      .status(200)
      .json({ status: true, message: 'user deleted successfully!' });
  } catch (error) {
    res.status(500).json({ status: false, message: 'error in the server' });
  }
};

module.exports = {
  createUser,
  getUser,
  deleteUser,
  updateUser
};
