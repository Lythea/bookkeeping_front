import Cookies from "universal-cookie";
import { showToast } from "@/components/toast";

const cookies = new Cookies();
const API_URL = process.env.NEXT_PUBLIC_API_URL + "/api/clients";

// Updated Client and Business interfaces
export interface Business {
  business_name: string;
  line_of_business: string;
  registered_address: string;
  started_date: string;
  tin: string;
  zip_code: string;
}

export interface Client {
  id?: number;
  firstname: string;
  lastname: string;
  middlename: string | null;
  birthday: string;
  email: string | null;
  contact_number: string | null;
  business: Business[];
}

// Function to get the Authorization headers with the token
const getAuthHeaders = () => {
  const token = cookies.get("authToken");
  console.log(token);

  if (!token) {
    throw new Error("User is not authenticated");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// Function to fetch all clients
export const fetchClients = async () => {
  try {
    const response = await fetch(API_URL, {
      headers: getAuthHeaders(),
      credentials: "include", // Make sure cookies are included
    });
    if (!response.ok) throw new Error("Failed to fetch clients");
    return response.json();
  } catch (error) {
    showToast("Failed to fetch clients", "error");
    throw error;
  }
};

// Function to fetch a specific client by ID
export const getClient = async (id: number) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      headers: getAuthHeaders(),
      credentials: "include", // Make sure cookies are included
    });
    if (!response.ok) throw new Error("Failed to fetch client");
    return response.json();
  } catch (error) {
    showToast("Failed to fetch client", "error");
    throw error;
  }
};

// Function to add a new client (including email and contact_number)
export const addClient = async (client: Omit<Client, "id">) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(client), // Send the updated client with email and contact_number
      credentials: "include", // Make sure cookies are included
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to add client:", errorText);
      throw new Error(errorText);
    }

    const data = await response.json();
    showToast("Client added successfully!", "success");
    return data;
  } catch (error) {
    showToast("Failed to add client", "error");
    throw error;
  }
};

// Function to update a specific client by ID (including email and contact_number)
export const updateClient = async (client: Client) => {
  try {
    const response = await fetch(`${API_URL}/${client.id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(client), // Send the updated client with email and contact_number
      credentials: "include", // Make sure cookies are included
    });

    if (!response.ok) throw new Error("Failed to update client");

    showToast("Client updated successfully!", "success");
    return response.json();
  } catch (error) {
    showToast("Failed to update client", "error");
    throw error;
  }
};

// Function to delete a specific client by ID
export const deleteClient = async (id: number) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
      credentials: "include", // Make sure cookies are included
    });

    if (!response.ok) throw new Error("Failed to delete client");

    showToast("Client deleted successfully!", "success");
    return id;
  } catch (error) {
    showToast("Failed to delete client", "error");
    throw error;
  }
};
