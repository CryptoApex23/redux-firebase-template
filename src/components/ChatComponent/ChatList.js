import React, { useEffect, useState } from 'react';
import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { auth, database } from '../../services/firebase';
import { useAuth } from '../../context/AuthContext';
import { getUserChats, searchUsersById, searchUsersByUsername } from '../../services/firestore';

const ChatsList = () => {
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState({});
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();


  useEffect(() => {
    const fetchChats = async () => {
      const userChats = await getUserChats(auth.currentUser.uid);
      setChats(userChats);

      // Fetch participants' names
      const participantsPromises = userChats.map(async (chat) => {
        const participantIds = chat.participants.filter(id => id !== auth.currentUser.uid);
        const participantNames = await Promise.all(participantIds.map(async (id) => {
          // Fetch user profile data here
          // For simplicity, let's assume a function getUserProfile that fetches user data
          const userProfile = await searchUsersById(id);
          return userProfile.username;
        }));

        return participantNames.join(', ');
      });

      const usersNames = await Promise.all(participantsPromises);
      const usersMap = userChats.reduce((acc, chat, index) => {
        acc[chat.chatId] = usersNames[index];
        return acc;
      }, {});
      setUsers(usersMap);
    };

    fetchChats();
  }, []);

  return (
    <Box sx={{ backgroundColor: 'transparent', padding: 2 }}>
      <List>
        {chats.map(chat => (
          <ListItem
            key={chat.chatId}
            button
            onClick={() => navigate(`/chat/${chat.chatId}`)}
            sx={{
              backgroundColor: '#333',
              marginBottom: 1,
              borderRadius: 1,
              '&:hover': {
                backgroundColor: '#444',
              },
            }}
          >
            <ListItemText
              primary={<Typography sx={{ color: 'white', fontWeight: 'bold' }}>{users[chat.chatId]}</Typography>}
              secondary={<Typography sx={{ color: 'white' }}>{chat.lastMessage}</Typography>}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ChatsList;
