import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { addTaxForm, updateTaxForm, deleteTaxForm } from "@/app/redux/services/taxcalendarService";

// Define the TaxForm interface
interface TaxForm {
  id: number; // This will be the primary key that the backend generates
  form_no: string; // form_no corresponds to 'form_no' in the backend validation
  latest_revision_date: string; // latest_revision_date corresponds to 'latest_revision_date' in the backend validation
  form_name: string; // form_name corresponds to 'form_name' in the backend validation
  due_date: string; // due_date corresponds to 'due_date' in the backend validation
}

// Define initial state
interface TaxCalendarState {
  taxForms: TaxForm[];
  taxForm?: TaxForm | null;
  loading: boolean;
  error?: string | null;
  reload: boolean; // Add reload state to trigger a refresh
}

const initialState: TaxCalendarState = {
  taxForms: [],
  taxForm: null,
  loading: false,
  error: null,
  reload: false, // Initial value is false, indicating no reload is needed
};

// Async Thunks (Wrapped with createAsyncThunk)
export const addTaxFormThunk = createAsyncThunk("taxcalendar/add", async (taxForm: Omit<TaxForm, "id">) => {
  return await addTaxForm(taxForm); // The function will now return the tax form after adding
});

export const updateTaxFormThunk = createAsyncThunk("taxcalendar/update", async (taxForm: TaxForm) => {
  return await updateTaxForm(taxForm); // The function will return the updated tax form
});

export const deleteTaxFormThunk = createAsyncThunk("taxcalendar/delete", async (id: number) => {
  await deleteTaxForm(id); // No return value needed, just perform the delete operation
  return id; // Return the deleted tax form's id to update the state
});

// ✅ Update Redux State Immediately After Adding, Editing, or Deleting
const taxcalendarSlice = createSlice({
  name: "taxcalendar",
  initialState,
  reducers: {
    // Action to manually trigger a reload
    triggerReload: (state) => {
      state.reload = true;
    },
    resetReload: (state) => {
      state.reload = false; // Reset the reload flag after a reload action
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle Adding TaxForm
      .addCase(addTaxFormThunk.fulfilled, (state, action: PayloadAction<TaxForm>) => {
        state.taxForms.push(action.payload); // Add the tax form to the list
      })
      // Handle Updating TaxForm
      .addCase(updateTaxFormThunk.fulfilled, (state, action: PayloadAction<TaxForm>) => {
        const index = state.taxForms.findIndex((taxForm) => taxForm.id === action.payload.id);
        if (index !== -1) {
          state.taxForms[index] = action.payload; // Update the existing tax form
        }
      })
      // Handle Deleting TaxForm
      .addCase(deleteTaxFormThunk.fulfilled, (state, action: PayloadAction<number>) => {
        state.taxForms = state.taxForms.filter((taxForm) => taxForm.id !== action.payload); // Removes the tax form from the list by ID
        state.reload = true; // Set reload to true after deleting a tax form
      })
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true; // Set loading to true when any async action is pending
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/fulfilled"),
        (state) => {
          state.loading = false; // Set loading to false when any async action is fulfilled
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false; // Set loading to false when any async action is rejected
       
        }
      );
  },
});

export const { triggerReload, resetReload } = taxcalendarSlice.actions; // Export triggerReload action
export default taxcalendarSlice.reducer;
