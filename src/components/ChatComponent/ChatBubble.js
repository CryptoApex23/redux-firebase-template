import React from 'react';
import { Box, Typography } from '@mui/material';
import './ChatBubble.css';

const ChatBubble = ({ message, isOwnMessage }) => {
  return (
    <Box
      className={`chat-bubble ${isOwnMessage ? 'own-message' : 'other-message'}`}
      sx={{
        alignSelf: isOwnMessage ? 'flex-end' : 'flex-start',
        backgroundColor: isOwnMessage ? '#0084ff' : '#e5e5ea',
        color: isOwnMessage ? 'white' : 'black',
        padding: '10px',
        borderRadius: '15px',
        marginBottom: '5px',
        maxWidth: '70%',
        wordBreak: 'break-word',
      }}
    >
      <Typography variant="body1">{message.text}</Typography>
      <Typography variant="caption" sx={{ textAlign: 'right', display: 'block' }}>
        {new Date(message.timestamp).toLocaleTimeString()}
      </Typography>
    </Box>
  );
};

export default ChatBubble;
