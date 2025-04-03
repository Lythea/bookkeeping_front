const API_URL = process.env.NEXT_PUBLIC_API_URL + "/api/taxcalendar"; // Use the environment variable

import { showToast } from "@/components/toast"; // Import toast

interface TaxForm {
  id: number; // This will be the primary key that the backend generates
  form_no: string; // form_no corresponds to 'form_no' in the backend validation
  latest_revision_date: string; // latest_revision_date corresponds to 'latest_revision_date' in the backend validation
  form_name: string; // form_name corresponds to 'form_name' in the backend validation
  due_date: string; // due_date corresponds to 'due_date' in the backend validation
}

export const fetchTaxForms = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch tax forms");
    return response.json();
  } catch (error) {
    showToast("Failed to fetch tax forms", "error");
    throw error;
  }
};

export const getTaxForm = async (id: number) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error("Failed to fetch tax form");
    return response.json();
  } catch (error) {
    showToast("Failed to fetch tax form", "error");
    throw error;
  }
};

export const addTaxForm = async (taxForm: Omit<TaxForm, "id">) => {

  try {
    console.log("🚀 Data being sent:", taxForm,API_URL);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taxForm),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to add tax form:", errorText);
      throw new Error(errorText);
    }

    const data = await response.json();
    console.log("✅ Server Response:", data);
    showToast("Tax form added successfully!", "success");
    return data;
  } catch (error) {
    showToast("Failed to add tax form", "error");
    throw error;
  }
};

export const updateTaxForm = async (taxForm: TaxForm) => {
  try {
    const response = await fetch(`${API_URL}/${taxForm.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taxForm),
    });

    if (!response.ok) throw new Error("Failed to update tax form");

    showToast("Tax form updated successfully!", "success");
    return response.json();
  } catch (error) {
    showToast("Failed to update tax form", "error");
    throw error;
  }
};

export const deleteTaxForm = async (id: number) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Failed to delete tax form");

    showToast("Tax form deleted successfully!", "success");
    return id; // Returning the ID for potential state updates
  } catch (error) {
    showToast("Failed to delete tax form", "error");
    throw error;
  }
};
