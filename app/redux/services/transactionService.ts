import { createAsyncThunk } from "@reduxjs/toolkit";
import { showToast } from "@/components/toast";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const API_URL = process.env.NEXT_PUBLIC_API_URL + "/api/transactions";

// Function to get the Authorization headers with the token
const getAuthHeaders = () => {
  const token = cookies.get("authToken");
  if (!token) {
    throw new Error("User is not authenticated");
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

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

// 🔁 1. Fetch All Transactions
export const fetchTransactionsThunk = createAsyncThunk(
  "transactions/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL, {
        headers: getAuthHeaders(),
        credentials: "include", // Include cookies in the request
      });
      if (!response.ok) throw new Error("Failed to fetch transactions");
      return await response.json();
    } catch (error) {
      showToast("Failed to fetch transactions", "error");
      return rejectWithValue(error.message || 'An unexpected error occurred');
    }
  }
);

// 🔁 2. Get Single Transaction
export const getTransactionThunk = createAsyncThunk(
  "transactions/fetchOne",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        headers: getAuthHeaders(),
        credentials: "include", // Include cookies in the request
      });
      if (!response.ok) throw new Error("Failed to fetch transaction");
      return await response.json();
    } catch (error) {
      showToast("Failed to fetch transaction", "error");
      return rejectWithValue(error.message || 'An unexpected error occurred');
    }
  }
);

// 🔁 3. Add Transaction
export const addTransactionThunk = createAsyncThunk(
  "transactions/add",
  async (transaction: Transaction, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(transaction),
        credentials: "include", // Include cookies in the request
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to add transaction:", errorText);
        throw new Error(errorText);
      }

      const data = await response.json();
      showToast("Transaction added successfully!", "success");
      return data;
    } catch (error) {
      showToast("Failed to add transaction", "error");
      return rejectWithValue(error.message || "Failed to add transaction");
    }
  }
);

// 🔁 4. Update Transaction
export const updateTransactionThunk = createAsyncThunk(
  "transactions/update",
  async (transaction: Transaction, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${transaction.id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(transaction),
        credentials: "include", // Include cookies in the request
      });

      if (!response.ok) throw new Error("Failed to update transaction");

      showToast("Transaction updated successfully!", "success");
      return await response.json();
    } catch (error) {
      showToast("Failed to update transaction", "error");
      return rejectWithValue(error.message || "Failed to update transaction");
    }
  }
);

// 🔁 5. Delete Transaction
export const deleteTransactionThunk = createAsyncThunk(
  "transactions/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
        credentials: "include", // Include cookies in the request
      });

      if (!response.ok) throw new Error("Failed to delete transaction");

      showToast("Transaction deleted successfully!", "success");
      return id;
    } catch (error) {
      showToast("Failed to delete transaction", "error");
      return rejectWithValue(error.message || "Failed to delete transaction");
    }
  }
);

// Update Status Thunk
export const updateStatusThunk = createAsyncThunk(
  "transactions/updateStatus",
  async ({ id, status }: { id: number; status: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/updateStatus/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
        credentials: "include", // Include cookies in the request
      });

      if (!response.ok) throw new Error("Failed to update status");

      return await response.json(); // Return the updated data
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update status"); // Return the error message if it fails
    }
  }
);

// Update Transact Thunk
export const updateTransactThunk = createAsyncThunk(
  "transactions/updateTransact",
  async ({ id, transact }: { id: number; transact: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/updateTransact/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ transact }),
        credentials: "include", // Include cookies in the request
      });

      if (!response.ok) throw new Error("Failed to update transact");

      return await response.json(); // Return the updated data
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update transact"); // Return the error message if it fails
    }
  }
);

// 🔁 6. Filter Transactions
export const filterTransactionsThunk = createAsyncThunk<
  Transaction[], // Adjust this type if needed
  { name?: string; dateFrom?: string; dateTo?: string },
  { rejectValue: string }
>(
  "transactions/filter",
  async (filters, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams(filters as any).toString();
      const fullUrl = `${API_URL}/filter?${queryParams}`;

      console.log("🔍 Filter Query Params:", filters);
      console.log("🌐 Full URL:", fullUrl);

      const response = await fetch(fullUrl, {
        headers: getAuthHeaders(),
        credentials: "include", // Include cookies in the request
      });

      console.log("📥 Raw Response Status:", response.status);

      if (!response.ok) throw new Error("Failed to filter transactions");

      const data = await response.json();
      console.log("✅ Filtered Transactions:", data);

      return data;
    } catch (error: any) {
      const errorMessage = error?.message || "Unknown error";
      console.error("❌ Filter Error:", errorMessage);
      showToast(errorMessage, "error");
      return rejectWithValue(errorMessage); // Return the error message as the payload
    }
  }
);
