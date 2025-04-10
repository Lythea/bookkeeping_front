const API_URL = process.env.NEXT_PUBLIC_API_URL + "/api/services";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { showToast } from "@/components/toast";

interface Form {
  name: string;
  file: string;
  price: string;
  description: string;
}

interface Service {
  id: number;
  service: string;
  forms: Form[];
}
export const fetchServicesThunk = createAsyncThunk("services/fetch", async () => {
  try {
    const response = await fetch(API_URL);
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
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error("Failed to fetch service");
    return response.json();
  } catch (error) {
    showToast("Failed to fetch service", "error");
    throw error;
  }
});

// Add a service (supports FormData)
export const addServiceThunk = createAsyncThunk(
  "services/add",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      // Log formData entries to see what data is being sent
      formData.forEach((value, key) => {
        if (value instanceof File) {
          // If it's a file, log the file's name, size, and type
          console.log(`${key}: File - Name: ${value.name}, Size: ${value.size} bytes, Type: ${value.type}`);
        } else {  
          // Otherwise, just log the value directly
          console.log(`${key}: ${value}`);
        }
      });
      console.log(API_URL)
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData, // FormData for file upload support
      });

      if (!response.ok) throw new Error("Failed to add service");

      return response.json();
    } catch (error) {
      console.error("Error in addServiceThunk:", error); // Log the error if any
      return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
  }
);
export const updateServiceThunk = createAsyncThunk("services/update", async (service: any) => {
  try {
    console.log("Data being sent to the API:", service);

    // Log the FormData contents
    console.log("FormData contents before dispatch:");
    for (let pair of service.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    const response = await fetch(`${API_URL}/${service.get("service_id")}`, {
      method: "POST",
      body: service, // Send FormData directly
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
    console.log("deleteFormThunk triggered", { serviceId, formIndex }); // Log the serviceId and formIndex

  
      const response = await fetch(`${API_URL}/${serviceId}/forms/${formIndex}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        console.error("Failed to delete form, response not ok", response);
        throw new Error("Failed to delete form");
      }

      // Log the successful response data
      const responseData = await response.json();
      showToast("Successfully deleted form:", responseData);

      // Return the service ID and form index for removing the form from the state
      return { serviceId, formIndex };

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
        },
        body: JSON.stringify({ service: serviceName }),
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

