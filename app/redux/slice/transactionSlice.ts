import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchTransactionsThunk,
  getTransactionThunk,
  addTransactionThunk,
  updateTransactionThunk,
  deleteTransactionThunk,
  updateStatusThunk,
  updateTransactThunk,
  filterTransactionsThunk,
} from "@/app/redux/services/transactionService";

// Transaction interface
interface Inquiry {
  name: string;
  price: string;
  service: string;
}
interface Transaction {
  id: number;
  name: string; // Full name of the client
  status: string;
  date: string;
  inquiries: Inquiry[];
  tin_id: string;
  business_name: string;
}


// State interface
interface TransactionState {
  transactions: Transaction[];
  transaction?: Transaction | null;
  filteredTransactions: Transaction[];
  loading: boolean;
  error?: string | null;
  reload: boolean;
}

const initialState: TransactionState = {
  transactions: [],
  transaction: null,
  filteredTransactions: [],
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
      .addCase(fetchTransactionsThunk.fulfilled, (state, action: PayloadAction<Transaction[]>) => {
        state.transactions = action.payload;
      })
      .addCase(getTransactionThunk.fulfilled, (state, action: PayloadAction<Transaction>) => {
        state.transaction = action.payload;
      })
      .addCase(addTransactionThunk.fulfilled, (state, action: PayloadAction<Transaction>) => {
        state.transactions.push(action.payload);
      })
      .addCase(updateTransactionThunk.fulfilled, (state, action: PayloadAction<Transaction>) => {
        const index = state.transactions.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
      })
      .addCase(deleteTransactionThunk.fulfilled, (state, action: PayloadAction<number>) => {
        state.transactions = state.transactions.filter((t) => t.id !== action.payload);
        state.reload = true;
      })
      .addCase(updateStatusThunk.fulfilled, (state, action: PayloadAction<Transaction>) => {
        const index = state.transactions.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
      })
      .addCase(updateTransactThunk.fulfilled, (state, action: PayloadAction<Transaction>) => {
        const index = state.transactions.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
      })
      .addCase(filterTransactionsThunk.fulfilled, (state, action: PayloadAction<Transaction[]>) => {
        state.filteredTransactions = action.payload;
      })
      .addMatcher((action) => action.type.endsWith("/pending"), (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher((action) => action.type.endsWith("/fulfilled"), (state) => {
        state.loading = false;
      })
      .addMatcher((action) => action.type.endsWith("/rejected"), (state, action) => {
        state.loading = false;
        state.error = "An unexpected error occurred";
      });
  },
});

export const { triggerReload, resetReload } = transactionSlice.actions;
export default transactionSlice.reducer;
