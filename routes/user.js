const express = require('express');
const {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  login,
  getUsers
} = require('../controllers/user');

const router = express.Router();

router.post('/', createUser);
router.post('/login', login);
router.get('/:id', getUser);
router.get('/', getUsers);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
