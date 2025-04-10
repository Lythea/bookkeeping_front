import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchServicesThunk,
  addServiceThunk,
  updateServiceThunk,
  deleteServiceThunk,
  deleteFormThunk,  // Import the deleteFormThunk
  updateServiceNameThunk,  // Import the updateServiceNameThunk
  deleteServiceWithFormsThunk,  // Import the deleteServiceWithFormsThunk
} from "@/app/redux/services/serviceService";

// Define Service interface
interface Service {
  id: number;
  service: string;
  forms: { name: string; file: string; price: string; description: string }[];
}

// Define initial state
interface ServiceState {
  services: Service[];
  service?: Service | null;
  loading: boolean;
  error?: string | null;
  reload: boolean; // Reload state to trigger a refresh
}

const initialState: ServiceState = {
  services: [],
  service: null,
  loading: false,
  error: null,
  reload: false,
};

const serviceSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    triggerReload: (state) => {
      state.reload = true;
    },
    resetReload: (state) => {
      state.reload = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServicesThunk.fulfilled, (state, action: PayloadAction<Service[]>) => {
        state.services = action.payload;
      })
      .addCase(addServiceThunk.fulfilled, (state, action: PayloadAction<Service>) => {
        state.services.push(action.payload);
      })
      .addCase(updateServiceThunk.fulfilled, (state, action: PayloadAction<Service>) => {
        const index = state.services.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.services[index] = action.payload;
        }
      })
      .addCase(deleteServiceThunk.fulfilled, (state, action: PayloadAction<number>) => {
        state.services = state.services.filter((s) => s.id !== action.payload);
        state.reload = true;
      })
      // Handle the deleteFormThunk action
      .addCase(deleteFormThunk.fulfilled, (state, action: PayloadAction<{ serviceId: number; formIndex: number }>) => {
        const { serviceId, formIndex } = action.payload;
        const service = state.services.find((s) => s.id === serviceId);
        if (service) {
          // Remove the form from the service
          service.forms.splice(formIndex, 1);
        }
      })
      // Handle the updateServiceNameThunk action
      .addCase(updateServiceNameThunk.fulfilled, (state, action: PayloadAction<Service>) => {
        const index = state.services.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.services[index] = action.payload;
        }
      })
      // Handle the deleteServiceWithFormsThunk action
      .addCase(deleteServiceWithFormsThunk.fulfilled, (state, action: PayloadAction<number>) => {
        state.services = state.services.filter((s) => s.id !== action.payload);
        state.reload = true;
      })
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/fulfilled"),
        (state) => {
          state.loading = false;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
        }
      );
  },
});

// Export actions and reducer
export { fetchServicesThunk, addServiceThunk, updateServiceThunk, deleteServiceThunk, deleteFormThunk, updateServiceNameThunk, deleteServiceWithFormsThunk };

export const { triggerReload, resetReload } = serviceSlice.actions;
export default serviceSlice.reducer;
