const express = require('express');
const {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  login
} = require('../controllers/user');

const router = express.Router();

router.post('/', createUser);
router.post('/login', login);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
