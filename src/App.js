import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import LoginPage from "./components/LoginPage";
import MainPage from "./components/MainPage";

import Profile from "./components/ProfilePage/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import "./App.css"
import NavBar from "./components/NavBar/NavBar";
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route
            path="/"
            element={
                <MainPage />
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
