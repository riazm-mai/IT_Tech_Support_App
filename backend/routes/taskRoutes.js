
const express = require('express');
const { getTasks, addTask, updateTask, deleteTask } = require('../controllers/taskController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getTasks).post(protect, admin,addTask);
router.route('/:id').put(protect, updateTask).delete(protect, deleteTask);

module.exports = router;
