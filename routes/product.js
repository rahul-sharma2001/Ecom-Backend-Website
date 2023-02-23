const express = require('express');
const cors = require('cors');

const router = express.Router();
const {
    createProduct,
    getOneProduct,
    updateProduct,
    deleteProduct,
    deleteVariant,
    getAllProduct
} = require("../controllers/product");

router.get('/',cors(),getAllProduct);
router.post('/',createProduct);
router.route('/:id').get(getOneProduct).patch(updateProduct).delete(deleteProduct);
router.route('/variant/:id').delete(deleteVariant);
module.exports = router