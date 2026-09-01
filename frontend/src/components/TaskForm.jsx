import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const TaskForm = ({ tasks, setTasks, editingTask, setEditingTask }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ title: '', description: '', incidentDate: '', priority: 'Low', category: 'Software' });

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title || '',
        description: editingTask.description || '',
        incidentDate: editingTask.incidentDate ? editingTask.incidentDate.substring(0, 10) : '',
        priority: editingTask.priority || 'Low',
        category: editingTask.category || 'Software'
      });
    } else {
      setFormData({ title: '', description: '', incidentDate: '', priority: 'Low', category: 'Software' });
    }
  }, [editingTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      if (editingTask) {
        const response = await axiosInstance.put(`/api/tasks/${editingTask._id}`, formData, config);
        setTasks(tasks.map((task) => (task._id === response.data._id ? response.data : task)));
      } else {
        const response = await axiosInstance.post('/api/tasks', formData, config);
        setTasks([...tasks, response.data]);
      }
      setEditingTask(null);
      setFormData({ title: '', description: '', incidentDate: '', priority: 'Low', category: 'Software' });
    } catch (error) {
      alert('Failed to save task.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingTask ? 'Edit Ticket' : 'Add IT Support Ticket'}</h1>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-1">Ticket Title</label>
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-1">Detailed Description</label>
        <input
          type="text"
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-1">Incident Date</label>
        <input
          type="date"
          value={formData.incidentDate}
          onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-1">Urgency Priority</label>
        <select
          value={formData.priority}
          onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          className="w-full p-2 border rounded"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-1">Issue Category</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full p-2 border rounded"
        >
          <option value="Software">Software</option>
          <option value="Hardware">Hardware</option>
          <option value="Network">Network</option>
          <option value="Access Management">Access Management</option>
        </select>
      </div>

      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {editingTask ? 'Update Ticket' : 'Add IT Support Ticket'}
      </button>
    </form>
  );
};

export default TaskForm;
