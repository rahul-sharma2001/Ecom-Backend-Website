const express = require('express');
const {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  login
} = require('../controllers/user');
const router = express.Router();

// const {getAllTasks,createTask,updateTask,deleteTask,getTask}=require('../controllers/tasks')//importing getAllTasks
// router.route('/').post(createUser)
router.post('/', createUser);
router.post('/login', login);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
// router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
