const sellerService = require('../services/seller');
let SellerService = new sellerService();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const createSeller = async (req, res) => {
  const seller = req.body;
  try {
    const hashedPassword = await bcrypt.hash(seller.password, 10);
    seller.password = hashedPassword;

    let addSeller = await SellerService.createSeller(seller);
    res.status(200).json({
      status: true,
      message: 'seller created successfully!'
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
const getSeller = async (req, res) => {
  try {
    const { id: sellerId } = req.params;
    const seller = await SellerService.getSeller({ _id: sellerId });
    if (!seller) {
      return res
        .status(404)
        .json({ status: false, message: `no seller with id: ${sellerId}` });
    }
    res.status(200).json({ status: true, seller });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const updateSeller = async (req, res) => {
  try {
    const { id: sellerId } = req.params;
    const seller = await SellerService.updateSeller(
      { _id: sellerId },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    if (!seller) {
      return res
        .status(404)
        .json({ status: false, message: `no seller with id: ${sellerId}` });
    }
    res
      .status(200)
      .json({ status: true, message: 'seller updated successfully!' });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
const deleteSeller = async (req, res) => {
  try {
    const { id: sellerId } = req.params;
    const seller = await SellerService.deleteSeller({ _id: sellerId });
    res
      .status(200)
      .json({ status: true, message: 'seller deleted successfully!' });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
const sellerLogin = async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const existingUser = await SellerService.getLoginSeller({
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
    res.status(200).json({ status: false, message: error.message });
  }
};

module.exports = {
  createSeller,
  getSeller,
  updateSeller,
  deleteSeller,
  sellerLogin
};
