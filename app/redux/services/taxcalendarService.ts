import { showToast } from "@/components/toast";
import Cookies from "universal-cookie";
const cookies = new Cookies();

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

const API_URL = process.env.NEXT_PUBLIC_API_URL + "/api/taxcalendar";

// Updated TaxForm interface based on model (only form_no, due_date, frequency)
interface TaxForm {
  id: number;
  form_no: string;
  due_date: string;
  frequency: string;
}

// Fetch all tax forms
export const fetchTaxForms = async () => {
  try {
    const response = await fetch(API_URL, {
      headers: getAuthHeaders(),
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch tax forms");
    return response.json();
  } catch (error) {
    showToast("Failed to fetch tax forms", "error");
    throw error;
  }
};

// Fetch a single tax form
export const getTaxForm = async (id: number) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      headers: getAuthHeaders(),
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch tax form");
    return response.json();
  } catch (error) {
    showToast("Failed to fetch tax form", "error");
    throw error;
  }
};

// Add a new tax form
export const addTaxForm = async (taxForm: Omit<TaxForm, "id">) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(taxForm),
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to add tax form:", errorText);
      throw new Error(errorText);
    }

    const data = await response.json();
    showToast("Tax form added successfully!", "success");
    return data;
  } catch (error) {
    showToast("Failed to add tax form", "error");
    throw error;
  }
};

// Update a tax form
export const updateTaxForm = async (taxForm: TaxForm) => {
  try {
    const response = await fetch(`${API_URL}/${taxForm.id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(taxForm),
      credentials: "include",
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("Error response from server:", errorResponse);
      throw new Error("Failed to update tax form");
    }

    const responseData = await response.json();
    showToast("Tax form updated successfully!", "success");
    return responseData;
  } catch (error) {
    console.error("❌ Failed to update tax form:", error);
    showToast("Failed to update tax form", "error");
    throw error;
  }
};

// Delete a tax form
export const deleteTaxForm = async (id: number) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
      credentials: "include",
    });

    if (!response.ok) throw new Error("Failed to delete tax form");

    showToast("Tax form deleted successfully!", "success");
    return id;
  } catch (error) {
    showToast("Failed to delete tax form", "error");
    throw error;
  }
};
