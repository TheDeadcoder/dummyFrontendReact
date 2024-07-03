import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const hash = window.location.hash.substr(1);
      const params = new URLSearchParams(hash);
      const accessToken = params.get('access_token');
      console.log('Access Token:', accessToken);

      if (accessToken) {
        try {
          const response = await axios.post(`http://127.0.0.1:8000/auth/exchange-token`, {
            token: accessToken
          });
          console.log('Response from server:', response);
          
          // Save the token in a cookie
          Cookies.set('auth_token', accessToken, { expires: 7 }); // Expires in 7 days

          navigate('/protected');
        } catch (error) {
          console.error('Error processing token:', error);
          navigate('/');
        }
      } else {
        navigate('/');
      }
    };

    handleOAuthCallback();
  }, [navigate]);

  return <div>Loading...</div>;
};

export default OAuthCallback;