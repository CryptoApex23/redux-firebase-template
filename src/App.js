import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import LoginPage from "./components/LoginPage/LoginPage";
import MainPage from "./components/MainPage/MainPage";

import Profile from "./components/ProfilePage/ProfilePage";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";
import NavBar from "./components/NavBar/NavBar";
import SideMenu from "./components/SideMenu/SideMenu";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@emotion/react";
import SearchUser from "./components/SearchUser/SearchUser";
const App = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <SideMenu />
        <div className={`main-content ${isMobile ? "mobile" : ""}`}>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/search" element={<SearchUser />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
