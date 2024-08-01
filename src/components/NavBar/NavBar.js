// src/components/NavBar.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, IconButton, Avatar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { logout } from "../../redux/actions/authActions";
import LoginIcon from '@mui/icons-material/Login';

const settings = ['Profile', 'Logout'];


const NavBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((store) => {return store.user});

  const handleProfileClick = (path) => {
    if(path === "Logout")
    {
        dispatch(logout());
        navigate('/login')
    }else{
        navigate(`/`+path);
    }
    handleCloseUserMenu();
  };


  const [anchorElUser, setAnchorElUser] = React.useState(null);


  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };


  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };


  return (
    <AppBar position="static" color="primary">
    <Container maxWidth="xl">
      <Toolbar disableGutters style={{display:"flex",justifyContent:"space-between"}}>
        <AdbIcon sx={{ display: { xs: 'none', md: 'flex' ,}, mr: 1 }} />
        <Typography
          variant="h6"
          noWrap
          component="a"
          href="#app-bar-with-responsive-menu"
          sx={{
            mr: 2,
            display: { xs: 'none', md: 'flex' },
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
          SANDBOX
        </Typography>
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <AdbIcon sx={{ display: { md: 'flex' }, mr: 1 }} />
        </Box>
        <Box sx={{ flexGrow: 0 }}>
        {user?.profilePicUrl ?  (<Tooltip title="Open settings" style={{display:"flex",justifyContent:"center",alignItems:"center",gap:10}}>
            <IconButton disableRipple={true} onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            <Typography>{user.username}</Typography>
                <Avatar alt="Remy Sharp" src={user.profilePicUrl} />
            </IconButton>
          </Tooltip>) : (<IconButton onClick={()=>{navigate('/login')}}><LoginIcon></LoginIcon></IconButton>)}
          <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {settings.map((setting) => (
              <MenuItem key={setting} onClick={()=>{
                handleProfileClick(setting)
              }}>
                <Typography textAlign="center">{setting}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </Container>
  </AppBar>
  );
};

export default NavBar;
