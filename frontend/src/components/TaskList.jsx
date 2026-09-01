import React from 'react';

const TaskList = ({ tasks, setTasks, setEditingTask, handleDelete }) => {
  return (
    <div>
      {tasks.map((task) => (
        <div key={task._id} className="bg-white p-4 shadow rounded mb-4">
          <h3 className="font-bold text-lg mb-1">{task.title}</h3>
          
          <p className="text-gray-700 text-sm mb-2">
            <span className="font-semibold text-gray-900">Description: </span>
            {task.description}
          </p>
          
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-semibold text-gray-900">Incident Date: </span>
            {task.deadline ? task.deadline.substring(0, 10) : 'N/A'}
          </p>
          
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-semibold text-gray-900">Priority: </span>
            <span className={`font-medium ${task.priority === 'Critical' || task.priority === 'High' ? 'text-red-600' : 'text-gray-700'}`}>
              {task.priority || 'Low'}
            </span>
          </p>
          
          <p className="text-sm text-gray-600 mb-4">
            <span className="font-semibold text-gray-900">Category: </span>
            {task.category || 'Software'}
          </p>

          <div className="flex gap-2">
            <button 
              onClick={() => setEditingTask(task)} 
              className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
            >
              Edit
            </button>
            <button 
              onClick={() => handleDelete(task._id)} 
              className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
