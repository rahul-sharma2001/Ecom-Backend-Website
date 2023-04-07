const express = require('express');
const {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  login,
  getUsers,
  updateId
} = require('../controllers/user');

const router = express.Router();

router.post('/', createUser);
router.post('/login', login);
router.get('/:id', getUser);
router.get('/', getUsers);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.patch('/updateId/:userId',updateId)

module.exports = router;
