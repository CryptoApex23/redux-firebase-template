import React from 'react';
import { auth } from '../services/firebase'; // Adjust path as necessary
import { logout } from '../redux/actions/authActions';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  const user = auth.currentUser;


  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logout()); // Log out and clear state
    navigate('/login'); // Redirect to login page
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.email}>{user?.email}</h1>
      <button onClick={handleLogout}>Sign out</button>

    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#333',
    color: '#fff',
  },
  email: {
    fontSize: '24px',
    textAlign: 'center',
  },
};

export default MainPage;
