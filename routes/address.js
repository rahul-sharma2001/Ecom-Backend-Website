const express = require('express');

const router = express.Router();
const {
  getCountries,
  getStates,
  getCities,
  createAddress,
  updateAddress,
  deleteAddress,
  findAddressByUserId,
  deleteUserAddressByAddressId
} = require('../controllers/address');

router.get('/countries', getCountries);
router.get('/states/:country_id', getStates);
router.get('/cities/:state_id', getCities);
router.post('/', createAddress);
router.put('/:id', updateAddress);
router.delete('/:id', deleteAddress);
router.delete('/:userId/:id', deleteUserAddressByAddressId);
router.get('/:userId', findAddressByUserId);

module.exports = router;
