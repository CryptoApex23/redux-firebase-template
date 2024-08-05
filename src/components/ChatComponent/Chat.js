import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, TextField, Button, List, ListItem, Avatar, Typography, CircularProgress } from '@mui/material';
import { auth, database } from '../../services/firebase';
import { sendMessage, onMessageListener, searchUsersById } from '../../services/firestore';
import ChatBubble from './ChatBubble';
import './Chat.css';
import { get, onValue, ref } from 'firebase/database';

const Chat = () => {
  const { chatId } = useParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [chatParticipants, setChatParticipants] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(true); // Default to authorized

  useEffect(() => {
    // Fetch messages and set up real-time listener
    const unsubscribe = onMessageListener(chatId, setMessages);
    
    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    
    // Check if user is authorized to view the chat
    const chatDetailsRef = ref(database, `chats/${chatId}/participants`);
    get(chatDetailsRef).then((snapshot) => {
      if (snapshot.exists()) {
        const participants = snapshot.val();
        if (!participants.includes(auth.currentUser.uid)) {
          setIsAuthorized(false);
        } else {
          setChatParticipants(participants);
          setIsAuthorized(true);
        }
      } else {
        setIsAuthorized(false);
      }
    });

    if (isAuthorized) {
      const unsubscribe = onMessageListener(chatId, setMessages);
      const fetchChatDetails = async () => {
        try {
          const chatRef = ref(database, `chats/${chatId}`);
          const chatSnapshot = await get(chatRef);
          const chatData = chatSnapshot.val();
  
          // Find the other user
          const currentUserId = auth.currentUser.uid;
          const otherUserId = chatData.participants.find(id => id !== currentUserId);
  
          if (otherUserId) {
            const userData = await searchUsersById(otherUserId);
            setOtherUser(userData);
          }
        } catch (error) {
          console.error('Error fetching chat details:', error);
        }
      };
  
      fetchChatDetails();
      return () => unsubscribe();
    }
  }, [chatId, isAuthorized]);

  useEffect(() => {
    // Fetch chat details and other user information
   
  }, [chatId]);

  const user = useSelector((store) => store.auth.user);

  const handleSendMessage = async () => {
    if (message.trim()) {
      await sendMessage(chatId, message, user, auth.currentUser.uid);
      setMessage('');
    }
  };

  if (!isAuthorized) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>
        <Typography variant="h5">This chat is not yours</Typography>
      </Box>
    );
  }

  return (
    <>
        {otherUser ? (  <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: 'calc(100vh - 100px)', maxHeight: '100vh' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '14px', color: 'white', padding: 2 }}>
        {/* Replace with dynamic data if available */}
        <Avatar src={otherUser.profilePicUrl} />
        <Typography>{otherUser.username ?? ""}</Typography>
      </Box>
      <List sx={{ flex: 1, overflowY: 'auto', padding: 2 }}>
        {messages.map((msg) => (
          <ListItem key={msg.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: msg.userId === auth.currentUser.uid ? 'flex-end' : 'flex-start' }}>
            <ChatBubble message={msg} isOwnMessage={msg.userId === auth.currentUser.uid} />
          </ListItem>
        ))}
      </List>
      <Box sx={{ display: 'flex', padding: 2, alignItems: 'center' }}>
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          variant="outlined"
          fullWidth
          placeholder="Type a message"
        />
        <Button onClick={handleSendMessage} variant="contained" sx={{ marginLeft: 1 }}>
          Send
        </Button>
      </Box>
    </Box>) : (<><CircularProgress></CircularProgress></>)}
    </>

  
  );
};

export default Chat;
