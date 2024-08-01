import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import theme from "./theme/theme";
import { ThemeProvider } from '@mui/material/styles';

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <ThemeProvider theme={theme}>

      <App />
      </ThemeProvider>
    </PersistGate>
  </Provider>
);
