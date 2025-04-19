import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  addTaxForm,
  updateTaxForm,
  deleteTaxForm,
} from "@/app/redux/services/taxcalendarService";

// ✅ Updated TaxForm interface
interface TaxForm {
  id: number;
  form_no: string;
  due_date: string;
  frequency: string;
}

// ✅ Slice state interface
interface TaxCalendarState {
  taxForms: TaxForm[];
  taxForm?: TaxForm | null;
  loading: boolean;
  error?: string | null;
  reload: boolean;
}

const initialState: TaxCalendarState = {
  taxForms: [],
  taxForm: null,
  loading: false,
  error: null,
  reload: false,
};

// ✅ Async Thunks

export const addTaxFormThunk = createAsyncThunk<TaxForm, Omit<TaxForm, "id">>(
  "taxcalendar/add",
  async (formData) => {
    return await addTaxForm(formData);
  }
);

export const updateTaxFormThunk = createAsyncThunk<TaxForm, TaxForm>(
  "taxcalendar/update",
  async (formData) => {
    return await updateTaxForm(formData);
  }
);

export const deleteTaxFormThunk = createAsyncThunk<number, number>(
  "taxcalendar/delete",
  async (id) => {
    await deleteTaxForm(id);
    return id;
  }
);

// ✅ Slice
const taxcalendarSlice = createSlice({
  name: "taxcalendar",
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
      .addCase(addTaxFormThunk.fulfilled, (state, action: PayloadAction<TaxForm>) => {
        state.taxForms.push(action.payload);
        state.reload = true;
      })
      .addCase(updateTaxFormThunk.fulfilled, (state, action: PayloadAction<TaxForm>) => {
        const index = state.taxForms.findIndex((form) => form.id === action.payload.id);
        if (index !== -1) {
          state.taxForms[index] = action.payload;
          state.reload = true;
        }
      })
      .addCase(deleteTaxFormThunk.fulfilled, (state, action: PayloadAction<number>) => {
        state.taxForms = state.taxForms.filter((form) => form.id !== action.payload);
        state.reload = true;
      })
      .addMatcher((action) => action.type.endsWith("/pending"), (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher((action) => action.type.endsWith("/fulfilled"), (state) => {
        state.loading = false;
      })
      .addMatcher((action) => action.type.endsWith("/rejected"), (state, action) => {
        state.loading = false;
      
      });
  },
});

export const { triggerReload, resetReload } = taxcalendarSlice.actions;
export default taxcalendarSlice.reducer;
