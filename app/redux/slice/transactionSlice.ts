import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchTransactionsThunk,
  getTransactionThunk,
  addTransactionThunk,
  updateTransactionThunk,
  deleteTransactionThunk,
  updateStatusThunk, // Import updateStatusThunk
  updateTransactThunk, // Import updateTransactThunk
  filterTransactionsThunk, // Import the new filter action
} from "@/app/redux/services/transactionService";

// Transaction interface
interface Transaction {
  id: number;
  service: string;
  name: string;
  address: string;
  email: string;
  contact: string;
  date: string;
  status: string;
  transact: string;
  inquiries: any[];
}

// State interface
interface TransactionState {
  transactions: Transaction[];
  transaction?: Transaction | null;
  filteredTransactions: Transaction[]; // Add this line
  loading: boolean;
  error?: string | null;
  reload: boolean;
}


const initialState: TransactionState = {
  transactions: [],
  transaction: null,
  filteredTransactions: [], // Initialize it as an empty array
  loading: false,
  error: null,
  reload: false,
};
const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    triggerReload: (state) => {
      state.reload = true;
    },
    resetReload: (state) => {
      state.reload = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔁 Fetch All
      .addCase(fetchTransactionsThunk.fulfilled, (state, action: PayloadAction<Transaction[]>) => {
        state.transactions = action.payload;
      })

      // 🔁 Get One
      .addCase(getTransactionThunk.fulfilled, (state, action: PayloadAction<Transaction>) => {
        state.transaction = action.payload;
      })

      // ➕ Add
      .addCase(addTransactionThunk.fulfilled, (state, action: PayloadAction<Transaction>) => {
        state.transactions.push(action.payload);
      })

      // ✏️ Update
      .addCase(updateTransactionThunk.fulfilled, (state, action: PayloadAction<Transaction>) => {
        const index = state.transactions.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
      })

      // ❌ Delete
      .addCase(deleteTransactionThunk.fulfilled, (state, action: PayloadAction<number>) => {
        state.transactions = state.transactions.filter((t) => t.id !== action.payload);
        state.reload = true;
      })

      // 🔄 Update Status
      .addCase(updateStatusThunk.fulfilled, (state, action: PayloadAction<Transaction>) => {
        const index = state.transactions.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
      })

      // 🔄 Update Transact
      .addCase(updateTransactThunk.fulfilled, (state, action: PayloadAction<Transaction>) => {
        const index = state.transactions.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
      })

      // 🔍 Filter Transactions
      .addCase(filterTransactionsThunk.fulfilled, (state, action: PayloadAction<Transaction[]>) => {
        state.transactions = action.payload;
      })

      // 🌀 Loading
      .addMatcher((action) => action.type.endsWith("/pending"), (state) => {
        state.loading = true;
        state.error = null;
      })

      // ✅ Success
      .addMatcher((action) => action.type.endsWith("/fulfilled"), (state) => {
        state.loading = false;
      })

      // ❗ Error
      .addMatcher((action) => action.type.endsWith("/rejected"), (state, action) => {
        state.loading = false;
        
      });
  },
});

export const { triggerReload, resetReload } = transactionSlice.actions;
export default transactionSlice.reducer;
