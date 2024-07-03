import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleAuth = async (provider) => {
    setError(null);
    try {
      const response = await axios.post(`http://127.0.0.1:8000/auth/${provider}`);
      if (response.data.redirect_url) {
        const authWindow = window.open(response.data.redirect_url, '_blank', 'width=500,height=600');
        
        if (!authWindow) {
          setError("Popup blocked. Please allow popups for this site and try again.");
          return;
        }

        const messageListener = async (event) => {
          if (event.data.token) {
            authWindow.close();
            window.removeEventListener('message', messageListener);
            
            try {
              const tokenResponse = await axios.post('http://127.0.0.1:8000/auth/exchange-token', {
                token: event.data.token
              });
              console.log('User data:', tokenResponse.data);
              localStorage.setItem('auth_token', event.data.token);
              localStorage.setItem('user_data', JSON.stringify(tokenResponse.data));
              navigate('/protected');
            } catch (error) {
              console.error('Error exchanging token:', error);
              setError("Failed to exchange token. Please try again.");
            }
          }
        };

        window.addEventListener('message', messageListener);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError("Authentication failed. Please try again.");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <button onClick={() => handleAuth('google')}>Login with Google</button>
      <button onClick={() => handleAuth('facebook')}>Login with Facebook</button>
    </div>
  );
};

export default Login;