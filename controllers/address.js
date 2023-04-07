const Country = require('../model/country');
const State = require('../model/state');
const City = require('../model/city');

const AddressService = require('../services/address');

let addressServiceInstance = new AddressService();

const getCountries = async (req, res) => {
  try {
    const countries = await Country.find({});
    res
      .status(200)
      .send({ success: true, msg: 'Countries data', data: countries });
  } catch (err) {
    res.status(400).send({ success: false, msg: err.message });
  }
};

const getStates = async (req, res) => {
  try {
    const states = await State.find({ country_id: req.params.country_id });
    res.status(200).send({ success: true, msg: 'States data', data: states });
  } catch (err) {
    res.status(400).send({ success: false, msg: err.message });
  }
};

const getCities = async (req, res) => {
  try {
    const cities = await City.find({ state_id: req.params.state_id });
    res.status(200).send({ success: true, msg: 'Cities data', data: cities });
  } catch (err) {
    res.status(400).send({ success: false, msg: err.message });
  }
};

const createAddress = async (req, res) => {
  const address = req.body;
  try {
    await addressServiceInstance.createAddress(address);
    res
      .status(201)
      .send({ status: true, message: 'Successfully address created' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: false, message: err });
  }
};

const updateAddress = async (req, res) => {
  try {
    const { id: addressId } = req.params;
    const updatedAddress = await addressServiceInstance.updateAddress(
      { _id: addressId },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedAddress) {
      return res.status(404).json({ status: 'address id not found' });
    }
    res
      .status(200)
      .send({ status: true, message: 'successfully address updated' });
  } catch (err) {
    res.status(500).json({ status: false, message: `error == ${err}` });
  }
};
const deleteUserAddressByAddressId = async (req, res) => {
  try {
    const { userId: userId, id: addressId } = req.params;
    const deleteAddress =
      await addressServiceInstance.deleteUserAddressByAddressId({
        userId: userId,
        id: addressId
      });
    res.status(200).json({
      status: true,
      message: 'address deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
const deleteAddress = async (req, res) => {
  try {
    const { id: addressId } = req.params;

    const deletedAddress = await addressServiceInstance.deleteAddress({
      _id: addressId
    });

    if (!deletedAddress) {
      return res.status(404).json({ status: 'address not delete' });
    }
    res
      .status(200)
      .json({ status: true, message: 'Successfully deleted address' });
  } catch (err) {
    res.status(500).json({ status: false, message: `error == ${err}` });
  }
};

const findAddressByUserId = async (req, res) => {
  try {
    const { userId: userId } = req.params;

    const address = await addressServiceInstance.findAddressByUserId({
      userId: userId
    });

    if (!address) {
      return res.status(404).json({ status: 'address not found' });
    }
    res
      .status(200)
      .json({ status: true, message: 'Successfully find ', data: address });
  } catch (err) {
    res.status(500).json({ status: false, message: `error == ${err}` });
  }
};

module.exports = {
  getCountries,
  getStates,
  getCities,
  createAddress,
  updateAddress,
  deleteAddress,
  findAddressByUserId,
  deleteUserAddressByAddressId
};
