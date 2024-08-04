import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchUsers } from "../../redux/actions/searchActions";
import {
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  CircularProgress,
  Typography,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const SearchUser = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { searchResults, loading, error } = useSelector((state) => {
    return state.search;
  });
  const handleSearch = (event) => {
    setQuery(event.target.value);
    if (event.target.value.length > 3) {
      dispatch(searchUsers(event.target.value));
    }
  };

  useEffect(() => {}, []);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",

        mt: 4,
      }}
    >
      <TextField
        label="Search Users"
        variant="outlined"
        value={query}
        onChange={handleSearch}
        sx={{
          marginTop: "0px",
          borderRadius: "8px",
          width: {
            xs: "100%", // full width on mobile
            sm: "50%", // 50% width on desktop
          },
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
          },
          mb: 2,
        }}
      />
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}
      <List style={{ width: "100%" }}>
        {searchResults.map((user) => (
          <ListItem
            key={user.id}
            sx={{
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.1)", // Change to desired hover color
                cursor: "pointer",
              },
              transition: "background-color 0.3s", // Smooth transition for hover effect
            }}
            style={{ cursor: "pointer" }}
            onClick={() => {
              navigate("/profile/" + user.id);
            }}
          >
            <ListItemAvatar>
              <Avatar alt={user.username} src={user.profilePicUrl} />
            </ListItemAvatar>
            <ListItemText primary={user.username} style={{ color: "white" }} />
            <ListItemText style={{ textAlign: "end", color: "white" }}>
              {user.game_points}
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default SearchUser;
