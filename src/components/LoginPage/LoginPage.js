import React from "react";
import { useDispatch } from "react-redux";
import { login } from "../../redux/actions/authActions";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import { Button } from "@mui/material";
const LoginPage = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div style={styles.container}> </div>; // Show a loading state while authentication status is being determined
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
    <div style={styles.container}>
      <Button variant="contained" color="primary" onClick={handleSignIn}>
        Sign in with Google
      </Button>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    padding: 20,
    justifyContent: "center",
    alignItems: "start",
    height: "100vh",
    backgroundColor: "#333",
    color: "#fff",
  },
};

export default LoginPage;
