import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import { 
  Table, 
  TableHead, 
  TableHeadCell, 
  TableBody, 
  TableRow, 
  TableCell 
} from 'flowbite-react';

const Admin = () => {
  const { user } = useAuth();
  
  
  const [activeTab, setActiveTab] = useState('tasks');

  
  const [tasks, setTasks] = useState([]);
  const [usersList, setUsersList] = useState([]);

  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState('task'); // 'ticket' or 'user'
  const [editingItem, setEditingItem] = useState(null);

  
  const [taskFormData, setTaskFormData] = useState({ title: '', description: '', deadline: '' });
  const [userFormData, setUserFormData] = useState({ name: '', email: '', university: '', address: '' });
  
  useEffect(() => {
    if (!user?.token) return;

    const fetchTasks = async () => {
      try {
        const response = await axiosInstance.get('/api/tasks/all', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setTasks(response.data);
      } catch (error) {
        alert('Failed to fetch all user tickets.');
      }
    };

    const fetchUsers = async () => {
      try {
          const response = await axiosInstance.get('/api/auth/users', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setUsersList(response.data);
      } catch (error) {
        alert('Failed to fetch registered system users.');
      }
    };

    if (activeTab === 'tasks') {
      fetchTasks();
    } else {
      fetchUsers();
    }
  }, [user, activeTab]);


  const handleTaskDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;
    try {
      await axiosInstance.delete(`/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTasks(tasks.filter((task) => (task._id || task.id) !== taskId));
    } catch (error) {
      alert('Failed to delete ticket.');
    }
  };

  const handleTaskEditClick = (task) => {
    setEditingItem(task);
    setDrawerMode('task');
    setTaskFormData({
      title: task.title || '',
      description: task.description || '',
      deadline: task.deadline ? task.deadline.split('T')[0] : ''
    });
    setIsDrawerOpen(true);
  };


  const handleUserDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user profile?")) return;
    try {
      await axiosInstance.delete(`/api/auth/users/${userId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setUsersList(usersList.filter((u) => (u._id || u.id) !== userId));
    } catch (error) {
      alert('Failed to delete user.');
    }
  };

  const handleUserEditClick = (u) => {
    setEditingItem(u);
    setDrawerMode('user');
    setUserFormData({
      name: u.name || '',
      email: u.email || '',
      university: u.university || '',
      address: u.address || ''
    });
    setIsDrawerOpen(true);
  };


  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const itemId = editingItem._id || editingItem.id;

    try {
      if (drawerMode === 'task') {
        const response = await axiosInstance.put(`/api/tasks/${itemId}`, taskFormData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setTasks(tasks.map((task) => ((task._id || task.id) === itemId ? response.data : task)));
      } else {
        const response = await axiosInstance.put(`/api/auth/profile/${itemId}`, userFormData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setUsersList(usersList.map((u) => ((u._id || u.id) === itemId ? response.data : u)));
      }
      setIsDrawerOpen(false);
      setEditingItem(null);
    } catch (error) {
      alert(`Failed to complete updates for this ${drawerMode}.`);
    }
  };
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <div className="container mx-auto p-6">
        
        {/*  */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`py-2 px-4 font-bold text-sm transition-all border-b-2 ${
              activeTab === 'tasks'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Manage Tickets
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`py-2 px-4 font-bold text-sm transition-all border-b-2 ${
              activeTab === 'users'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Manage Users
          </button>
        </div>

        <h1 className="text-2xl font-bold mb-4">
          {activeTab === 'tasks' ? 'All User Tickets' : 'All Registered Users'}
        </h1>

        {/* */}
        {activeTab === 'tasks' && (
          tasks.length > 0 ? (
            <Table hoverable className="shadow-md">
              <TableHead>
                <TableRow className="bg-gray-100 dark:bg-gray-700">
                  <TableHeadCell className="text-left bg-gray-100 dark:bg-gray-700">Ticket Title</TableHeadCell>
                  <TableHeadCell className="text-left bg-gray-100 dark:bg-gray-700">Description</TableHeadCell>
                  <TableHeadCell className="text-left bg-gray-100 dark:bg-gray-700">Owner ID</TableHeadCell>
                  <TableHeadCell className="text-left bg-gray-100 dark:bg-gray-700">Delete</TableHeadCell>
                  <TableHeadCell className="text-left bg-gray-100 dark:bg-gray-700">Edit</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody className="divide-y">
                {tasks.map((task) => (
                  <TableRow key={task._id || task.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <TableCell className="text-left font-medium text-gray-900 dark:text-white">{task.title}</TableCell>
                    <TableCell className="text-left">{task.description}</TableCell>
                    <TableCell className="text-left text-xs text-gray-500">{task.user}</TableCell>
                    <TableCell className="text-left">
                      <span className="font-medium text-red-500 hover:underline cursor-pointer" onClick={() => handleTaskDelete(task._id || task.id)}>Delete</span>
                    </TableCell>
                    <TableCell className="text-left">
                      <span className="text-teal-500 hover:underline cursor-pointer" onClick={() => handleTaskEditClick(task)}>Edit</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : <p className="text-gray-500">No tickets found inside system collections.</p>
        )}

        {/* */}
        {activeTab === 'users' && (
          usersList.length > 0 ? (
            <Table hoverable className="shadow-md">
              <TableHead>
                <TableRow className="bg-gray-100 dark:bg-gray-700">
                  <TableHeadCell className="text-left bg-gray-100 dark:bg-gray-700">Name</TableHeadCell>
                  <TableHeadCell className="text-left bg-gray-100 dark:bg-gray-700">Email</TableHeadCell>
                  <TableHeadCell className="text-left bg-gray-100 dark:bg-gray-700">University</TableHeadCell>
                  <TableHeadCell className="text-left bg-gray-100 dark:bg-gray-700">Address</TableHeadCell>
                  <TableHeadCell className="text-left bg-gray-100 dark:bg-gray-700">Delete</TableHeadCell>
                  <TableHeadCell className="text-left bg-gray-100 dark:bg-gray-700">Edit</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody className="divide-y">
                {usersList.map((u) => (
                  <TableRow key={u._id || u.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <TableCell className="text-left font-medium text-gray-900 dark:text-white">{u.name || 'N/A'}</TableCell>
                    <TableCell className="text-left">{u.email}</TableCell>
                    <TableCell className="text-left">{u.university || 'N/A'}</TableCell>
                    <TableCell className="text-left">{u.address || 'N/A'}</TableCell>
                    <TableCell className="text-left">
                      <span className="font-medium text-red-500 hover:underline cursor-pointer" onClick={() => handleUserDelete(u._id || u.id)}>Delete</span>
                    </TableCell>
                    <TableCell className="text-left">
                      <span className="text-teal-500 hover:underline cursor-pointer" onClick={() => handleUserEditClick(u)}>Edit</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : <p className="text-gray-500">No registered users found inside system collections.</p>
        )}
      </div>

      {/* */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity" onClick={() => setIsDrawerOpen(false)} />
      )}

      {/*  */}
      <div className={`fixed top-0 right-0 z-50 h-screen p-6 overflow-y-auto transition-transform bg-white w-96 dark:bg-gray-800 shadow-2xl border-l border-gray-200 dark:border-gray-700 ${
        isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {drawerMode === 'task' ? 'Edit Task Info' : 'Edit User Profile'}
          </h2>
          <button type="button" onClick={() => setIsDrawerOpen(false)} className="text-gray-400 hover:text-gray-900 text-sm p-1.5">✕</button>
        </div>

        <form onSubmit={handleFormSubmit} className="bg-white p-1 space-y-4">
          {drawerMode === 'task' ? (
            <>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
                <input type="text" value={taskFormData.title} onChange={(e) => setTaskFormData({ ...taskFormData, title: e.target.value })} className="w-full mb-4 p-2 border rounded" required />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                <input type="text" value={taskFormData.description} onChange={(e) => setTaskFormData({ ...taskFormData, description: e.target.value })} className="w-full mb-4 p-2 border rounded" required />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Deadline</label>
                <input type="date" value={taskFormData.deadline} onChange={(e) => setTaskFormData({ ...taskFormData, deadline: e.target.value })} className="w-full mb-4 p-2 border rounded" required />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                <input type="text" value={userFormData.name} onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })} className="w-full mb-4 p-2 border rounded" required />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                <input type="email" value={userFormData.email} onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })} className="w-full mb-4 p-2 border rounded" required />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">University</label>
                <input type="text" value={userFormData.university} onChange={(e) => setUserFormData({ ...userFormData, university: e.target.value })} className="w-full mb-4 p-2 border rounded" />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Address</label>
                <input type="text" value={userFormData.address} onChange={(e) => setUserFormData({ ...userFormData, address: e.target.value })} className="w-full mb-4 p-2 border rounded" />
              </div>
            </>
          )}

          <div className="flex space-x-2 pt-4">
            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">Update Record</button>
            <button type="button" onClick={() => setIsDrawerOpen(false)} className="w-full bg-gray-200 text-gray-800 p-2 rounded hover:bg-gray-300 transition">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Admin;
