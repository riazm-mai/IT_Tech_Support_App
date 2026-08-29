
const express = require('express');
const { getTasks, addTask, updateTask, deleteTask } = require('../controllers/taskController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, admin, getTasks).post(protect, admin,addTask);
router.route('/:id').put(protect, admin, updateTask).delete(protect, admin, deleteTask);

module.exports = router;
