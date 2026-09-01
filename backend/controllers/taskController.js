const Task = require('../models/Task');

const addTask = async (req, res) => {
  const { title, description, deadline, priority, category } = req.body;

  try {
    const task = await Task.create({
      user: req.user.id,
      title,
      description,
      deadline,
      priority: priority || 'Low',
      category: category || 'Software'
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTask = async (req, res) => {
  const { title, description, completed, deadline, priority, category } = req.body;

  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.title = title !== undefined ? title : task.title;
    task.description = description !== undefined ? description : task.description;
    task.completed = completed ?? task.completed;
    task.deadline = deadline !== undefined ? deadline : task.deadline;
    task.priority = priority !== undefined ? priority : task.priority;
    task.category = category !== undefined ? category : task.category;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    await Task.deleteOne({ _id: req.params.id });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllTasksAdmin = async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTasks, addTask, updateTask, deleteTask, getAllTasksAdmin };
