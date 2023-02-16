const express = require('express');
const router = express.Router();
const {
    createProduct,
    getOneProduct,
    updateProduct,
    deleteProduct,
    deleteVariant,
    filterProduct,
    getAllProduct
} = require("../controllers/product");

router.route('/').get(getAllProduct).post(createProduct);
router.route('/:id').get(getOneProduct).patch(updateProduct).delete(deleteProduct);
router.route('/variant/:id').delete(deleteVariant);
router.route('/filter').get(filterProduct);

module.exports = router