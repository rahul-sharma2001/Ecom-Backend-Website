const reviewModel = require('../model/review');
const moment = require('moment');
class ReviewService {
  async createReview(reviewInfo) {
    try {
      if (!reviewInfo) {
        throw new Error('review details is required');
      }
      const savedReview = await reviewModel.create(reviewInfo);
      return savedReview;
    } catch (error) {
      throw error;
    }
  }

  async getReviewForProduct(id) {
    try {
      if (!id) {
        throw new Error('id is required');
      }

      const getReview = await reviewModel.findOne(id);
      return getReview;
    } catch (error) {
      throw error;
    }
  }

  async getAllReview(productId) {
    try {
      if (!productId) {
        throw new Error('productId is required');
      }

      const getAllReview = await reviewModel.find(productId);
      return getAllReview;
    } catch (error) {
      throw error;
    }
  }

  async updateReview(id, update, opts) {
    try {
      if (!id) {
        throw new Error('id is required');
      }
      const updatedReview = await reviewModel.findOneAndUpdate(
        id,
        update,
        opts
      );
      return updatedReview;
    } catch (error) {
      throw error;
    }
  }

  async deleteReview(id) {
    try {
      if (!id) {
        throw new Error('id is required');
      }

      const deletedReview = await reviewModel.findOneAndDelete(id);
      return deletedReview;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ReviewService;
