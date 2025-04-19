import { createAsyncThunk } from "@reduxjs/toolkit";
import { showToast } from "@/components/toast";
import Cookies from "universal-cookie";
const cookies = new Cookies();

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


// Function to get the Authorization headers with the token
const getAuthHeaders = (requiresAuth = true) => {
  if (requiresAuth) {
    const token = cookies.get("authToken");
    if (!token) {
      throw new Error("User is not authenticated");
    }
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }
  return {
    "Content-Type": "application/json",
  };
};

const API_URL = process.env.NEXT_PUBLIC_API_URL + "/api/transactions";

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
      return await response.json();  // Ensures the fetched data matches the Transaction structure
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
      return await response.json(); // Ensures the data returned matches the Transaction structure
    } catch (error) {
      showToast("Failed to fetch transaction", "error");
      return rejectWithValue(error.message || 'An unexpected error occurred');
    }
  }
);

// ➕ 3. Add Transaction
export const addTransactionThunk = createAsyncThunk(
  "transactions/add",
  async (transaction: Transaction, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: getAuthHeaders(false),  // Passing false, meaning no token is required
        body: JSON.stringify(transaction),  // Ensure the request matches the Transaction structure
        credentials: "include", // Include cookies in the request
      });

      if (!response.ok) {
        const errorText = await response.text();
        const errorStatus = response.status;
        const errorDetails = {
          status: errorStatus,
          message: errorText,
          url: API_URL,
          requestPayload: transaction, // Include the request payload for debugging
        };

        console.error("Failed to add transaction:", errorDetails);
        throw new Error(`Error ${errorStatus}: ${errorText}`);
      }

      const data = await response.json();
      showToast("Transaction added successfully!", "success");
      return data;  // Ensure the returned data matches the Transaction structure
    } catch (error) {
      const detailedError = {
        message: error.message || "Unknown error",
        stack: error.stack,
        time: new Date().toISOString(),
        transaction,
        apiUrl: API_URL,
      };

      console.error("Transaction error details:", detailedError);

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
        body: JSON.stringify(transaction),  // Ensure the body matches the Transaction structure
        credentials: "include", // Include cookies in the request
      });

      if (!response.ok) throw new Error("Failed to update transaction");

      showToast("Transaction updated successfully!", "success");
      return await response.json(); // Ensures the returned data matches the Transaction structure
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
      return id;  // Return the id to update the state
    } catch (error) {
      showToast("Failed to delete transaction", "error");
      return rejectWithValue(error.message || "Failed to delete transaction");
    }
  }
);

// 🔄 6. Update Status
export const updateStatusThunk = createAsyncThunk(
  "transactions/updateStatus",
  async ({ id, status }: { id: number; status: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/updateStatus/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }), // Ensure the request matches the Transaction structure
        credentials: "include", // Include cookies in the request
      });

      if (!response.ok) throw new Error("Failed to update status");
 showToast("Transaction updated successfully!", "success");
      return await response.json();  // Ensure the returned data matches the Transaction structure
    } catch (error) {
       showToast("Failed to update transaction", "error");
      return rejectWithValue(error.message || "Failed to update status");
    }
  }
);

// 🔄 7. Update Transact
export const updateTransactThunk = createAsyncThunk(
  "transactions/updateTransact",
  async ({ id, transact }: { id: number; transact: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/updateTransact/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ transact }), // Ensure the request matches the Transaction structure
        credentials: "include", // Include cookies in the request
      });

      if (!response.ok) throw new Error("Failed to update transact");

      return await response.json();  // Ensure the returned data matches the Transaction structure
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update transact");
    }
  }
);

// 🔁 8. Filter Transactions
export const filterTransactionsThunk = createAsyncThunk<
  Transaction[], // Adjust this type to match your `Transaction` interface
  { name?: string; dateFrom?: string; dateTo?: string },
  { rejectValue: string }
>(
  "transactions/filter",
  async (filters, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams(filters as any).toString();
      const fullUrl = `${API_URL}/filter?${queryParams}`;
      const response = await fetch(fullUrl, {
        headers: getAuthHeaders(),
        credentials: "include", // Include cookies in the request
      });

      if (!response.ok) throw new Error("Failed to filter transactions");

      const data = await response.json(); // Ensure the data returned matches the Transaction structure

      // Log the data to the console to inspect the result
      console.log("Filtered Transactions Data:", data);

      return data;
    } catch (error: any) {
      const errorMessage = error?.message || "Unknown error";
      console.error("❌ Filter Error:", errorMessage);
      showToast(errorMessage, "error");
      return rejectWithValue(errorMessage);
    }
  }
);

