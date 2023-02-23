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
router.post('/', createAddress)
router.put('/:id', updateAddress )
router.delete('/:id',deleteAddress)
router.get('/:userId', findAddressByUserId)


module.exports = router