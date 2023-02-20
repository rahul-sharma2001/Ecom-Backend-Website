const express = require('express');
const {
  createSeller,
  getSeller,
  updateSeller,
  deleteSeller,
  sellerLogin
} = require('../controllers/selller');

const router = express.Router();

router.post('/', createSeller);
router.post('/login', sellerLogin);
router.get('/:id', getSeller);
router.put('/:id', updateSeller);
router.delete('/:id', deleteSeller);
module.exports = router;
