import React from 'react';
import { useDispatch } from 'react-redux';
import {login} from '../redux/actions/authActions'




const LoginPage = () => {
  const dispatch = useDispatch();


  const handleSignIn = async () => {
    try {
       await dispatch(login())
        // Dispatch login action or update Redux state
    } catch (error) {
      console.error('Error signing in with Google:', error.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <button onClick={handleSignIn}>Sign in with Google</button>
    </div>
  );
};

export default LoginPage;
