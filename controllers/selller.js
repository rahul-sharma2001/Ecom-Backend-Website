const sellerService = require('../services/seller');
let SellerService = new sellerService();

const createSeller = async (req, res) => {
  const seller = req.body;
  try {
    console.log(seller);
    let addSeller = await SellerService.createSeller(seller);
    res.status(200).json({
      status: true,
      message: 'seller created successfully!'
    });
  } catch (error) {
    res.status(500).json({ status: false, message: `error == ${error}` });
    console.log(error);
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
    console.log('error===', error);
    res.status(500).json({ status: false, message: `error == ${error}` });
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
    res.status(500).json({ status: false, message: error });
  }
};
const deleteSeller = async (req, res) => {
  try {
    const { id: sellerId } = req.params;
    const seller = await SellerService.deleteSeller({ _id: sellerId });
    if (!seller) {
      return res.status(404).json({ msg: `no seller with id: ${sellerId}` });
    }
    res
      .status(200)
      .json({ status: true, message: 'seller deleted successfully!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: error });
  }
};
module.exports = { createSeller, getSeller, updateSeller, deleteSeller };
