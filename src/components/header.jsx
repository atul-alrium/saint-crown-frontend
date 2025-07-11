import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/exchange_logo.png';
import profile from '../assets/images/profile.png';
import logoutIcon from '../assets/images/logout.png';

const Header = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);

  const baseURL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${baseURL}/api/afd1/check-auth`, {
          method: 'GET',
          credentials: 'include'
        });
        const data = await res.json();

        if (data.authenticated && data.user && data.user.username) {
          setUsername(data.user.username);
        } else {
          navigate('/'); // or use '/'
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        navigate('/');
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      // Clear local/session storage
      localStorage.clear();
      sessionStorage.clear();

      // Call logout API
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/afd1/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        navigate('/'); // Redirect to login page
      } else {
        console.error('Failed to logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="header">
      <div className="bank-logo">
        <div className="logo-icon">
          <img src={logo} alt="Saint Crown Logo" className="logo-image" />
        </div>
        <div className="bank-info">
          <h1>Saint Crown Industrial Loan Co Banking User Wallet</h1>
          <p>Federal Charter #87650129354 • Digital Asset Management</p>
        </div>
      </div>

      <div className="user-section">
        <div className="user-avatar">
          <span>Hi {username ? username : ''}</span>
          <img className="profile-img" src={profile} alt="Profile" />
        </div>
        <img
          className="logout-btn logout"
          src={logoutIcon}
          alt="Logout"
          width="20"
          onClick={handleLogout}
          style={{ cursor: 'pointer' }}
        />
      </div>
    </div>
  );
};

export default Header;
