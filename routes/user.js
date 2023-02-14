const express = require('express');
const {
  createUser,
  getUser,
  updateUser,
  deleteUser
} = require('../controllers/user');
const router = express.Router();

router.post('/', createUser);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
