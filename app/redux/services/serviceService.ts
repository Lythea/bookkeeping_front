import { createAsyncThunk } from "@reduxjs/toolkit";
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

const API_URL = process.env.NEXT_PUBLIC_API_URL + "/api/services";

export const fetchServicesThunk = createAsyncThunk("services/fetch", async () => {
  try {
    const response = await fetch(API_URL, {
      headers: getAuthHeaders(),
      credentials: "include", // Include cookies in the request
    });
    if (!response.ok) throw new Error("Failed to fetch services");
    return response.json();
  } catch (error) {
    showToast("Failed to fetch services", "error");
    throw error;
  }
});

// Fetch a single service
export const getServiceThunk = createAsyncThunk("services/get", async (id: number) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      headers: getAuthHeaders(),
      credentials: "include", // Include cookies in the request
    });
    if (!response.ok) throw new Error("Failed to fetch service");
    return response.json();
  } catch (error) {
    showToast("Failed to fetch service", "error");
    throw error;
  }
});
export const addServiceThunk = createAsyncThunk(
  "services/add",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      console.log("Sending FormData to the API:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value instanceof File ? "File" : value);
      }

      const token = cookies.get("authToken");
      if (!token) throw new Error("User is not authenticated");

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Do NOT manually set "Content-Type" here
        },
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Validation error:", errorResponse);
        return rejectWithValue(errorResponse);
      }
      showToast("Service added successfully","success")
      return response.json();
    } catch (error) {
      console.error("Error in addServiceThunk:", error);
      return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
  }
);

export const updateServiceThunk = createAsyncThunk("services/update", async (service: any) => {
  console.log(service)
  try {
          const token = cookies.get("authToken");
      if (!token) throw new Error("User is not authenticated");

    const response = await fetch(`${API_URL}/${service.get("service_id")}`, {
      method: "POST",
         headers: {
          Authorization: `Bearer ${token}`,
          // Do NOT manually set "Content-Type" here
        },
      body: service, // Send FormData directly
      credentials: "include", // Include cookies in the request
    });

    if (!response.ok) throw new Error("Failed to update service");

    showToast("Service updated successfully!", "success");
    return response.json();
  } catch (error) {
    console.error("Error updating service:", error);
    showToast("Failed to update service", "error");
    throw error;
  }
});

// Delete a service
export const deleteServiceThunk = createAsyncThunk("services/delete", async (id: number) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
      credentials: "include", // Include cookies in the request
    });
    if (!response.ok) throw new Error("Failed to delete service");
    showToast("Service deleted successfully!", "success");
    return id; // Return deleted service ID
  } catch (error) {
    showToast("Failed to delete service", "error");
    throw error;
  }
});

// Thunk to delete a form from a service
export const deleteFormThunk = createAsyncThunk(
  "services/deleteForm",
  async (
    { serviceId, formIndex }: { serviceId: number; formIndex: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${API_URL}/${serviceId}/forms/${formIndex}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
        credentials: "include", // Include cookies in the request
      });

      if (!response.ok) {
        throw new Error("Failed to delete form");
      }

      // Log the successful response data
      const responseData = await response.json();
      showToast("Successfully deleted form:", responseData);

      // Return the service ID and form index for removing the form from the state
      return { serviceId, formIndex };

    } catch (error) {
      console.error("Error in deleteFormThunk:", error);
      showToast("Failed to delete form", "error");
      return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
  }
);

export const updateServiceNameThunk = createAsyncThunk(
  "services/updateServiceName",
  async ({ serviceId, serviceName }: { serviceId: number; serviceName: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${serviceId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(), // Add Authorization headers
        },
        body: JSON.stringify({ service: serviceName }),
        credentials: "include", // Include cookies in the request
      });

      if (!response.ok) throw new Error("Failed to update service name");

      showToast("Service name updated successfully!", "success");
      return response.json(); // Returning the updated service data
    } catch (error) {
      console.error("Error updating service name:", error);
      showToast("Failed to update service name", "error");
      return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
  }
);

// Delete a service with its associated forms and files
export const deleteServiceWithFormsThunk = createAsyncThunk(
  "services/deleteServiceWithForms",
  async (serviceId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${serviceId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
        credentials: "include", // Include cookies in the request
      });

      if (!response.ok) throw new Error("Failed to delete service");

      showToast("Service and its forms deleted successfully!", "success");
      return serviceId; // Return the service ID to remove it from the state
    } catch (error) {
      console.error("Error deleting service:", error);
      showToast("Failed to delete service", "error");
      return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
  }
);
