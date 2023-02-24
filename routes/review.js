const express = require('express');
const {
  createReview,
  getReviewForProduct,
  getAllReview,
  updateReview,
  deleteReview
} = require('../controllers/review');
const router = express.Router();

router.post('/', createReview);
router.get('/:id', getReviewForProduct);
router.get('/allReview/:productId', getAllReview);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);

module.exports = router;