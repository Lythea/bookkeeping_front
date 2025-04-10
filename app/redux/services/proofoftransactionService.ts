const API_URL = process.env.NEXT_PUBLIC_API_URL + "/api/proofoftransactions"; // Use the environment variable

import { showToast } from "@/components/toast"; // Import toast

interface ProofOfTransaction {
  id: number;
  title: string;
  description: string;
  type: "image" | "video" | "embed";
  content: string;
}

export const fetchProofOfTransactions = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch proof of transactions");
    return response.json();
  } catch (error) {
    showToast("Failed to fetch proof of transactions", "error");
    throw error;
  }
};

export const getProofOfTransaction = async (id: number) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error("Failed to fetch proof of transaction");
    return response.json();
  } catch (error) {
    showToast("Failed to fetch proof of transaction", "error");
    throw error;
  }
};

export const addProofOfTransaction = async (proofOfTransaction: Omit<ProofOfTransaction, "id">) => {
  try {
    console.log("🚀 Data being sent:", proofOfTransaction);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(proofOfTransaction),
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

export const updateProofOfTransaction = async (proofOfTransaction: ProofOfTransaction) => {
  try {
    const response = await fetch(`${API_URL}/${proofOfTransaction.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(proofOfTransaction),
    });

    if (!response.ok) throw new Error("Failed to update proof of transaction");

    showToast("Proof of transaction updated successfully!", "success");
    return response.json();
  } catch (error) {
    showToast("Failed to update proof of transaction", "error");
    throw error;
  }
};

export const deleteProofOfTransaction = async (id: number) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Failed to delete proof of transaction");

    showToast("Proof of transaction deleted successfully!", "success");
    return id; // Returning the ID for potential state updates
  } catch (error) {
    showToast("Failed to delete proof of transaction", "error");
    throw error;
  }
};
