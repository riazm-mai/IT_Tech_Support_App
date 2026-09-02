
const express = require('express');
const { getTasks, addTask, updateTask, deleteTask, getAllTasksAdmin } = require('../controllers/taskController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();


router.route('/').get(protect, getTasks).post(protect, addTask);
router.route('/:id').put(protect, updateTask).delete(protect, deleteTask);
router.route('/all').get(protect, admin, getAllTasksAdmin);

module.exports = router;