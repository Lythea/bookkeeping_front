// slices/proofoftransactionSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { addProofOfTransaction, updateProofOfTransaction, deleteProofOfTransaction, fetchProofOfTransactions } from "@/app/redux/services/proofoftransactionService";

// Define the ProofOfTransaction interface
interface ProofOfTransaction {
  id: number;
  title: string;
  description: string;
  type: "image" | "video" | "embed";
  content: string;
}

// Define initial state
interface ProofOfTransactionState {
  proofOfTransactions: ProofOfTransaction[];
  proofOfTransaction?: ProofOfTransaction | null;
  loading: boolean;
  error?: string | null;
  reload: boolean; // Add reload state to trigger a refresh
}

const initialState: ProofOfTransactionState = {
  proofOfTransactions: [],
  proofOfTransaction: null,
  loading: false,
  error: null,
  reload: false, // Initial value is false, indicating no reload is needed
};

// Async Thunks (Wrapped with createAsyncThunk)
export const fetchProofOfTransactionsThunk = createAsyncThunk("proofoftransactions/fetch", async () => {
  return await fetchProofOfTransactions(); // The function will return all proof of transactions
});

export const addProofOfTransactionThunk = createAsyncThunk("proofoftransactions/add", async (proofOfTransaction: Omit<ProofOfTransaction, "id">) => {
  return await addProofOfTransaction(proofOfTransaction); // The function will now return the proof of transaction after adding
});

export const updateProofOfTransactionThunk = createAsyncThunk("proofoftransactions/update", async (proofOfTransaction: ProofOfTransaction) => {
  return await updateProofOfTransaction(proofOfTransaction); // The function will return the updated proof of transaction
});

export const deleteProofOfTransactionThunk = createAsyncThunk("proofoftransactions/delete", async (id: number) => {
  await deleteProofOfTransaction(id); // No return value needed, just perform the delete operation
  return id; // Return the deleted proof of transaction's id to update the state
});

// ✅ Update Redux State Immediately After Adding, Editing, or Deleting
const proofOfTransactionSlice = createSlice({
  name: "proofoftransactions",
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
      // Handle Fetching Proof Of Transactions
      .addCase(fetchProofOfTransactionsThunk.fulfilled, (state, action: PayloadAction<ProofOfTransaction[]>) => {
        state.proofOfTransactions = action.payload; // Populate the list with fetched proof of transactions
      })
      // Handle Adding Proof Of Transaction
      .addCase(addProofOfTransactionThunk.fulfilled, (state, action: PayloadAction<ProofOfTransaction>) => {
        state.proofOfTransactions.push(action.payload); // Add the proof of transaction to the list
      })
      // Handle Updating Proof Of Transaction
      .addCase(updateProofOfTransactionThunk.fulfilled, (state, action: PayloadAction<ProofOfTransaction>) => {
        const index = state.proofOfTransactions.findIndex((proof) => proof.id === action.payload.id);
        if (index !== -1) {
          state.proofOfTransactions[index] = action.payload; // Update the existing proof of transaction
        }
      })
      // Handle Deleting Proof Of Transaction
      .addCase(deleteProofOfTransactionThunk.fulfilled, (state, action: PayloadAction<number>) => {
        state.proofOfTransactions = state.proofOfTransactions.filter((proof) => proof.id !== action.payload); // Removes the proof of transaction from the list by ID
        state.reload = true; // Set reload to true after deleting a proof of transaction
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

export const { triggerReload, resetReload } = proofOfTransactionSlice.actions; // Export triggerReload action
export default proofOfTransactionSlice.reducer;
