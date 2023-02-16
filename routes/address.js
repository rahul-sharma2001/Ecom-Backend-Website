const express = require('express')


const router = express.Router()
const {
    getCountries,
    getStates,
    getCities,
    createAddress, 
    updateAddress,
    deleteAddress,
    findAddressByUserId
} = require('../controllers/address')


router.get('/countries', getCountries)
router.get('/states', getStates)
router.get('/cities', getCities)
router.post('/create-address', createAddress)
router.put('/update-address/:id', updateAddress )
router.delete('/delete-address/:id',deleteAddress)
router.get('/address-byUserId/:userId', findAddressByUserId)


module.exports = router