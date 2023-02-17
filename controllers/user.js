const UserService = require('../services/user');
let userService = new UserService();
//in this controller/tasks file we are writing all the res.send stuff and importing it in routes/tasks trough getAllTasks obj
const createUser = async (req, res) => {
  const user = req.body;
  try {
    let adduser = await userService.createUser(user);
    res
      .status(200)
      .json({ status: true, message: 'user created successfully!' });
  } catch (error) {
    res.status(500).json({ status: false, message: `error == ${error}` });
    console.log(error);
  }
  //    res.json(user)
};
const getUser = async (req, res) => {
  try {
    // console.log(findUser.toString(), ", = ", req.params)
    const { id: userId } = req.params;
    const user = await userService.getUser({ _id: userId });
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

// async function h(userId){
//    return await userModel.findOne({ _id: userId });
// }

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
    res.status(500).json({ status: false, message: error });
  }
};
const deleteUser = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const user = await userService.deleteUser({ _id: userId });
    if (!user) {
      return res.status(404).json({ msg: `no task with id: ${userId}` });
    }
    res
      .status(200)
      .json({ status: true, message: 'user deleted successfully!' });
  } catch (error) {
    res.status(500).json({ status: false, message: 'error in the server' });
  }
};
module.exports = { createUser, getUser, deleteUser, updateUser };
