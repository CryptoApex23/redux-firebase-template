// src/components/ProtectedRoute.js
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDispatch } from "react-redux";
import { fetchUserProfile } from "../redux/actions/authActions";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(()=>{
    if(isAuthenticated)
    {
      dispatch(fetchUserProfile());
    }
  },[dispatch,isAuthenticated])


  if (!isAuthenticated) {
    // Redirect them to the /login page if not logged in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
