import {
  Person,
  SearchSharp,
  Home,
  ChatBubble,
} from "@mui/icons-material";

const menuItems = [
  { text: "Home", icon: <Home />, path: "" },
  { text: "Profile", icon: <Person />, path: "profile" },
  { text: "Search", icon: <SearchSharp />, path: "search" },
  { text: "Chat", icon: <ChatBubble />, path: "chat" },
  // Add more menu items here
];

export default menuItems;
