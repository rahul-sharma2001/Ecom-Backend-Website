const express=require('express')
const {createCategory, getCategory, updateCategory, deleteCategory} = require('../controllers/category')
const router = express.Router();


router.post('/', createCategory)
router.get('/:parent', getCategory)
router.put('/:name', updateCategory);
router.delete('/:name', deleteCategory);

// router.put('/', updateCategory)
// router.delete('/', deleteCateogry)


module.exports = router