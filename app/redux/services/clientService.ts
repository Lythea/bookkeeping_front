const API_URL = process.env.NEXT_PUBLIC_API_URL + "/api/clients"; // Use the environment variable

import { showToast } from "@/components/toast"; // Import toast

interface Client {
  id: number;
  name: string;
  phone: string;
  address: string;
  business_type: string; // ✅ Matches backend
  business_name: string; // ✅ Matches backend
  tin_id: string; // ✅ Matches backend
}

export const fetchClients = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch clients");
    return response.json();
  } catch (error) {
    showToast("Failed to fetch clients", "error");
    throw error;
  }
};

export const getClient = async (id: number) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error("Failed to fetch client");
    return response.json();
  } catch (error) {
    showToast("Failed to fetch client", "error");
    throw error;
  }
};

export const addClient = async (client: Omit<Client, "id">) => {
  try {
    console.log("🚀 Data being sent:", client);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(client),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to add client:", errorText);
      throw new Error(errorText);
    }

    const data = await response.json();
    console.log("✅ Server Response:", data);
    showToast("Client added successfully!", "success");
    return data;
  } catch (error) {
    showToast("Failed to add client", "error");
    throw error;
  }
};

export const updateClient = async (client: Client) => {
  try {
    const response = await fetch(`${API_URL}/${client.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(client),
    });

    if (!response.ok) throw new Error("Failed to update client");

    showToast("Client updated successfully!", "success");
    return response.json();
  } catch (error) {
    showToast("Failed to update client", "error");
    throw error;
  }
};

export const deleteClient = async (id: number) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Failed to delete client");

    showToast("Client deleted successfully!", "success");
    return id; // Returning the ID for potential state updates
  } catch (error) {
    showToast("Failed to delete client", "error");
    throw error;
  }
};
