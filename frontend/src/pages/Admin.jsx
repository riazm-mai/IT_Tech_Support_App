import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const Admin = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetches all system users for administrative overview
        const response = await axiosInstance.get('/api/auth/users', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setUsers(response.data);
      } catch (error) {
        alert('Failed to fetch registered system users.');
      }
    };

    fetchUsers();
  }, [user]);

  return (
        <div>
            <h1>Admin Dashboard</h1>
            <h2>Registered Users</h2>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>{user.email}</li>
                ))}
            </ul>
        </div>
    );
};

export default Admin;