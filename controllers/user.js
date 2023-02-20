const UserService = require('../services/user');
const userModel = require('../model/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const user = require('../model/user');
require('dotenv').config();

let userServiceInstance = new UserService();
//in this controller/tasks file we are writing all the res.send stuff and importing it in routes/tasks trough getAllTasks obj
const createUser = async (req, res) => {
  const user = req.body;
  try {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    let adduser = await userServiceInstance.createUser(user);

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
    const user = await userServiceInstance
      .getUser({ _id: userId })
      .select('-password');
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
    const user = await userServiceInstance.updateUser(
      { _id: userId },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: `no user with id: ${userId}` });
    }
    res
      .status(200)
      .json({ status: true, message: 'user updated successfully!' });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
const deleteUser = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const user = await userServiceInstance.deleteUser({ _id: userId });

    res
      .status(200)
      .json({ status: true, message: 'user deleted successfully!' });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const existingUser = await userServiceInstance.getUser({
      emailId: emailId
    });
    if (!existingUser) {
      res.status(401).json({
        status: false,
        message: 'invalid emailId or password'
      });
    } else {
      const matchPassword = await bcrypt.compare(
        password,
        existingUser.password
      );

      if (!matchPassword) {
        return res.status(401).json({
          status: false,
          message: 'invalid emailId or password'
        });
      } else {
        const jwtToken = jwt.sign(
          { id: existingUser._id },
          process.env.JWT_SECRET_KEY
        );

        res.status(200).json({
          status: true,
          message: 'loggined successfully!',
          token: jwtToken
        });
      }
    }
  } catch (error) {
    console.log('error = ', error);
    res.status(200).json({ status: false, message: error.message });
  }
};
module.exports = { createUser, getUser, deleteUser, updateUser, login };
