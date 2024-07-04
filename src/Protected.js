import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Protected = () => {
  const [message, setMessage] = useState('');
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const storedUserData = localStorage.getItem('user_data');

    if (!token) {
      navigate('/');
    } else {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData));
      }

      const fetchProtectedData = async () => {
        try {
          const response = await axios.get('http://127.0.0.1:8000/protected');
          setMessage(response.data.message);
        } catch (error) {
          console.error('Protected route error:', error);
          if (error.response && error.response.status === 401) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
            navigate('/');
          }
        }
      };

      fetchProtectedData();
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        await axios.post('http://127.0.0.1:8000/api/v1/auth/logout', {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage and navigate regardless of the API call result
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      navigate('/');
    }
  };

  return (
    <div>
      <h1>Protected Page</h1>
      <p>{message}</p>
      {userData && (
        <div>
          <h2>User Information:</h2>
          <p>User ID: {userData.user_id}</p>
          <p>Email: {userData.email}</p>
          <p>Role: {userData.role}</p>
        </div>
      )}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Protected;