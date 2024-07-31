import React, { useState } from 'react';
import { auth } from '../services/firebase'; // Adjust path as necessary
import { logout } from '../redux/actions/authActions';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ConfirmationDialog from './ConfirmationDialog/ConfirmationDialog';

const MainPage = () => {
  const user = auth.currentUser;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingLogout, setPendingLogout] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsDialogOpen(true);
    setPendingLogout(true);
  };

  const handleConfirmLogout = async () => {
    setIsDialogOpen(false);
    if (pendingLogout) {
      await dispatch(logout());
      navigate('/login'); 
      setPendingLogout(false);
    }
  };

  const handleCancelLogout = () => {
    setIsDialogOpen(false);
    setPendingLogout(false);
  };
  
  return (
    <div style={styles.container}>
      <h1 style={styles.email}>{user?.email}</h1>
      <button onClick={handleLogout}>Sign out</button>
      <ConfirmationDialog
        isOpen={isDialogOpen}
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
        message="Are you sure you want to log out?"
      />
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
