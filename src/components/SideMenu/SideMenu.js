import React, { useEffect, useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import "./SideMenu.css";
import menuItems from "../../utils/menu_items";
import { auth } from "../../services/firebase";
import { useAuth } from "../../context/AuthContext";

const SideMenu = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation(); // Get current location
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  
  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  useEffect(() => {}, [isAuthenticated]);

  const isActive = (path) => {
    if (path === "profile") {
      return location.pathname.startsWith(`/profile/`);
    }
    return location.pathname === `/${path}`;
  };

  const drawer = (
    <List>
      {menuItems.map((item, index) => (
        <ListItem
          style={{ cursor: "pointer" }}
          key={index + "_menu_item"}
          className={`menu-item ${isActive(item.path) ? "active" : ""}`} // Conditionally add "active" class
          onClick={() => {
            if (item.path === "profile") {
              navigate(`/` + item.path + "/" + auth.currentUser.uid);
            } else {
              navigate(`/` + item.path);
            }
          }}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItem>
      ))}
    </List>
  );

  return (
    <>
      {isMobile ? (
        <Drawer anchor="left" open={open} onClose={handleDrawerToggle}>
          {drawer}
        </Drawer>
      ) : (
        <>{isAuthenticated && <div className="side-menu">{drawer}</div>}</>
      )}
    </>
  );
};

export default SideMenu;
