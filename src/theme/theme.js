// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark', // Enable dark mode
    primary: {
      main: '#3f51b5', // Main color for primary
    },

    secondary: {
      main: '#f50057', // Main color for secondary
    },
    background: {
      default: '#333', // Background color of the app
      paper: '#424242', // Background color of paper components
    },
    text: {
      primary: '#fff', // Primary text color
      secondary: '#bbb', // Secondary text color
    },
    // Add any additional customization here
  },
  components: {
   
    MuiInputBase: {
      styleOverrides: {
        root: {
          color: '#fff',
        },
        input: {
          color: '#fff',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          margin: '10px 0',
          backgroundColor: '#222',
          '& .MuiInputBase-root': {
            color: '#fff',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#424242',
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: '#3f51b5',
        },
      },
    },
    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          color: '#fff',
          backgroundColor: '#3f51b5',
        },
      },
    },
    // Add more components if needed
  },
});

export default theme;
