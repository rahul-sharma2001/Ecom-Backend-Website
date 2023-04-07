const express = require('express')

const router = express.Router()

const { createOffers,updateOffers,deleteOffers,getOffers } = require('../controllers/offers')

router.post('/', createOffers)
router.put('/:id', updateOffers)
router.delete('/:id', deleteOffers)
router.get('/', getOffers)


module.exports = router