// slices/clientSlice.js
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { addClient, updateClient, deleteClient } from "@/app/redux/services/clientService";

// Define the Client interface
interface Client {
  id: number;
  name: string;
  phone: string;
  address: string;
  business_type: string;
  business_name: string;
  tin_id: string;
}

// Define initial state
interface ClientState {
  clients: Client[];
  client?: Client | null;
  loading: boolean;
  error?: string | null;
  reload: boolean; // Add reload state to trigger a refresh
}

const initialState: ClientState = {
  clients: [],
  client: null,
  loading: false,
  error: null,
  reload: false, // Initial value is false, indicating no reload is needed
};

// Async Thunks (Wrapped with createAsyncThunk)
export const addClientThunk = createAsyncThunk("clients/add", async (client: Omit<Client, "id">) => {
  return await addClient(client); // The function will now return the client after adding
});

export const updateClientThunk = createAsyncThunk("clients/update", async (client: Client) => {
  return await updateClient(client); // The function will return the updated client
});

export const deleteClientThunk = createAsyncThunk("clients/delete", async (id: number) => {
  await deleteClient(id); // No return value needed, just perform the delete operation
  return id; // Return the deleted client's id to update the state
});

// ✅ Update Redux State Immediately After Adding, Editing, or Deleting
const clientSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {
    // Action to manually trigger a reload
    triggerReload: (state) => {
      state.reload = true;
    },
    resetReload: (state) => {
      state.reload = false; // Reset the reload flag after a reload action
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle Adding Client
      .addCase(addClientThunk.fulfilled, (state, action: PayloadAction<Client>) => {
        state.clients.push(action.payload); // Add the client to the list
      })
      // Handle Updating Client
      .addCase(updateClientThunk.fulfilled, (state, action: PayloadAction<Client>) => {
        const index = state.clients.findIndex((client) => client.id === action.payload.id);
        if (index !== -1) {
          state.clients[index] = action.payload; // Update the existing client
        }
      })
      // Handle Deleting Client
      .addCase(deleteClientThunk.fulfilled, (state, action: PayloadAction<number>) => {
        state.clients = state.clients.filter((client) => client.id !== action.payload); // Removes the client from the list by ID
        state.reload = true; // Set reload to true after deleting a client
      })
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true; // Set loading to true when any async action is pending
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/fulfilled"),
        (state) => {
          state.loading = false; // Set loading to false when any async action is fulfilled
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false; // Set loading to false when any async action is rejected
      
        }
      );
  },
});

export const { triggerReload, resetReload } = clientSlice.actions; // Export triggerReload action
export default clientSlice.reducer;
