import { configureStore } from "@reduxjs/toolkit";
import clientData from "./slice/clientSlice";

export const store = configureStore({
  reducer: {
    clients: clientData,
  },
});

// Export RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
