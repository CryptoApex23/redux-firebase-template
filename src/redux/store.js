import persistStore from "redux-persist/es/persistStore";
import { configureStore } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage";
import { thunk } from "redux-thunk";
import rootReducer from "./reducers";

const persistConfig = {
  key: "auth",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        // Optionally, you can also ignore other actions if needed
      },
    }).concat(thunk),
});

const persistor = persistStore(store);

export { store, persistor };
