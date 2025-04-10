import Cookies from "universal-cookie";
import { showToast } from "@/components/toast";

const cookies = new Cookies();
const API_URL = process.env.NEXT_PUBLIC_API_URL + "/api/clients";

const getAuthHeaders = () => {
  const token = cookies.get("authToken");
  
  // Log the token to see what it contains
  console.log("🚀 authToken:", token);
  
  if (!token) {
    throw new Error("User is not authenticated");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};


interface Client {
  id: number;
  name: string;
  phone: string;
  address: string;
  business_type: string;
  business_name: string;
  tin_id: string;
}

export const fetchClients = async () => {
  try {
    const response = await fetch(API_URL, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch clients");
    return response.json();
  } catch (error) {
    showToast("Failed to fetch clients", "error");
    throw error;
  }
};

export const getClient = async (id: number) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      headers: getAuthHeaders(),
    });
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
      headers: getAuthHeaders(),
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
      headers: getAuthHeaders(),
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
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error("Failed to delete client");

    showToast("Client deleted successfully!", "success");
    return id;
  } catch (error) {
    showToast("Failed to delete client", "error");
    throw error;
  }
};
