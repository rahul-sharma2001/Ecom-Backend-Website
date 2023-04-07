const UserService = require('../services/user');
const userModel = require('../model/user');
const bcrypt = require('bcrypt');
const user = require('../model/user');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
require('dotenv').config();

let userService = new UserService();
const createUser = async (req, res) => {
  const user = req.body;

  if (!user.role) {
    user.role = 'user';
  }
  try {
    let addUser = await userService.createUser(user);

    if (addUser.role === 'user') {
      res
        .status(200)
        .json({ status: true, message: '  User created successfully!' });
    } else if (addUser.role === 'admin') {
      res
        .status(200)
        .json({ status: true, message: 'Admin created successfully!' });
    } else {
      res
        .status(200)
        .json({ status: true, message: 'Seller created successfully!' });
    }
  } catch (error) {
    res.status(404).json({ status: false, message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const user = await userService.getUser(userId);
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
    res.status(500).json({ status: false, message: error.message });
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

const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const existingUser = await userService.login({
      emailId,
      password
    });

    if (existingUser.status == false) {
      res.status(401).json(existingUser);
    } else {
      res.status(200).json(existingUser);
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
const getUsers = async (req, res) => {
  try {
    const users = await userService.getFilteredUsers(req.query);
    if (users.length !== 0) {
      res.status(200).json({ status: true, users });
    } else {
      res.status(500).json({ status: false, message: 'user not found' });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const updateId = async (req, res) => {
  const { cartProductsInTempId } = req.body;
  const { userId } = req.params;
  console.log("userId: ",userId, "cartProductsInTempId: ",cartProductsInTempId)
  try {
    const updatedId = await userService.getupdatedId({
      userId,
      cartProductsInTempId
    });
    console.log(updatedId);
    res.status(200).json({ status: true, data: updatedId });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  createUser,
  getUser,
  deleteUser,
  updateUser,
  login,
  getUsers,
  updateId
};
