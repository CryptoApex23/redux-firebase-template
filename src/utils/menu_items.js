import {
  Person,
  SearchSharp,
  Leaderboard,
  Home,
  Search,
} from "@mui/icons-material";

const menuItems = [
  { text: "Home", icon: <Home />, path: "" },
  { text: "Profile", icon: <Person />, path: "profile" },
  { text: "Friend", icon: <SearchSharp />, path: "search" },
  { text: "Leaderboard", icon: <Leaderboard />, path: "" },
  // Add more menu items here
];

export default menuItems;
