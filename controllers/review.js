const ReviewService = require('../services/review');
const reviewModel = require('../model/user');
let reviewServiceInstance = new ReviewService();

const createReview = async (req, res) => {
  const review = req.body;
  try {
    let adduser = await reviewServiceInstance.createReview(review);
    res
      .status(200)
      .json({ status: true, message: 'review created successfully!',review:adduser });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getReviewForProduct = async (req, res) => {
  try {
    const { id: reviewId } = req.params;
    const review = await reviewServiceInstance.getReviewForProduct({ _id: reviewId });
    if (!review) {
      return res
        .status(404)
        .json({ status: false, message: `no review with id: ${reviewId}` });
    }
    res.status(200).json({ status: true, review });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: error.message });
  }
};

const getAllReview = async (req, res) => {
  try {
    const { productId: productId } = req.params;
    const review = await reviewServiceInstance.getAllReview({ productId: productId });
    if (!review) {
      return res
        .status(404)
        .json({ status: false, message: `no review with id: ${productId}` });
    }
    res.status(200).json({ status: true, review });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: error.message });
  }
};

const updateReview = async (req, res) => {
  try {
    const { id: reviewId } = req.params;
    const review = await reviewServiceInstance.updateReview(
      { _id: reviewId },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    if (!review) {
      return res
        .status(404)
        .json({ status: false, message: `no review with id: ${reviewId}` });
    }
    res
      .status(200)
      .json({ status: true, message: 'review updated successfully!' });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { id: reviewId } = req.params;
    const review = await reviewServiceInstance.deleteReview({ _id: reviewId });
    if (!review) {
      return res.status(404).json({ msg: `no review with id: ${reviewId}` });
    }
    res
      .status(200)
      .json({ status: true, message: 'user deleted successfully!' });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = { createReview, getReviewForProduct,getAllReview, updateReview, deleteReview };
