import { configureStore } from "@reduxjs/toolkit";
import clientData from "./slice/clientSlice";
import transactionReducer from "./slice/transactionSlice";
export const store = configureStore({
  reducer: {
      transactions: transactionReducer,
    clients: clientData,
  },
});

// Export RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
