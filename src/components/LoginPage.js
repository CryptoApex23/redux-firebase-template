import React from "react";
import { useDispatch } from "react-redux";
import { login } from "../redux/actions/authActions";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const LoginPage = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Show a loading state while authentication status is being determined
  }

  if (isAuthenticated) {
    // Redirect to the home page if the user is authenticated
    return <Navigate to="/" replace />;
  }
  const handleSignIn = async () => {
    try {
      dispatch(login());
      // Dispatch login action or update Redux state
    } catch (error) {
      console.error("Error signing in with Google:", error.message);
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
