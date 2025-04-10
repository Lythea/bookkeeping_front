import Cookies from "universal-cookie";
import { showToast } from "@/components/toast";

const cookies = new Cookies();
const API_URL = process.env.NEXT_PUBLIC_API_URL + "/api/proofoftransactions";

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

interface ProofOfTransaction {
  id: number;
  title: string;
  description: string;
  type: "image" | "video" | "embed";
  content: string;
}

// Fetch all proof of transactions
export const fetchProofOfTransactions = async () => {
  try {
    const response = await fetch(API_URL, {
      credentials: "include", // Make sure cookies are included
    });
    if (!response.ok) throw new Error("Failed to fetch proof of transactions");
    return response.json();
  } catch (error) {
    showToast("Failed to fetch proof of transactions", "error");
    throw error;
  }
};

// Fetch a specific proof of transaction by ID
export const getProofOfTransaction = async (id: number) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      headers: getAuthHeaders(),
      credentials: "include", // Make sure cookies are included
    });
    if (!response.ok) throw new Error("Failed to fetch proof of transaction");
    return response.json();
  } catch (error) {
    showToast("Failed to fetch proof of transaction", "error");
    throw error;
  }
};

// Add a new proof of transaction
export const addProofOfTransaction = async (proofOfTransaction: Omit<ProofOfTransaction, "id">) => {
  try {
    console.log("🚀 Data being sent:", proofOfTransaction);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(proofOfTransaction),
      credentials: "include", // Make sure cookies are included
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to add proof of transaction:", errorText);
      throw new Error(errorText);
    }

    const data = await response.json();
    console.log("✅ Server Response:", data);
    showToast("Proof of transaction added successfully!", "success");
    return data;
  } catch (error) {
    showToast("Failed to add proof of transaction", "error");
    throw error;
  }
};

// Update a proof of transaction by ID
export const updateProofOfTransaction = async (proofOfTransaction: ProofOfTransaction) => {
  try {
    const response = await fetch(`${API_URL}/${proofOfTransaction.id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(proofOfTransaction),
      credentials: "include", // Make sure cookies are included
    });

    if (!response.ok) throw new Error("Failed to update proof of transaction");

    showToast("Proof of transaction updated successfully!", "success");
    return response.json();
  } catch (error) {
    showToast("Failed to update proof of transaction", "error");
    throw error;
  }
};

// Delete a proof of transaction by ID
export const deleteProofOfTransaction = async (id: number) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
      credentials: "include", // Make sure cookies are included
    });

    if (!response.ok) throw new Error("Failed to delete proof of transaction");

    showToast("Proof of transaction deleted successfully!", "success");
    return id;
  } catch (error) {
    showToast("Failed to delete proof of transaction", "error");
    throw error;
  }
};
