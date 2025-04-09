// slices/announcementSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { addAnnouncement, updateAnnouncement, deleteAnnouncement } from "@/app/redux/services/announcementService";

// Define the Announcement interface
interface Announcement {
  id: number;
  title: string;
  description: string;
  date: string;
}

// Define initial state
interface AnnouncementState {
  announcements: Announcement[];
  announcement?: Announcement | null;
  loading: boolean;
  error?: string | null;
  reload: boolean; // Add reload state to trigger a refresh
}

const initialState: AnnouncementState = {
  announcements: [],
  announcement: null,
  loading: false,
  error: null,
  reload: false, // Initial value is false, indicating no reload is needed
};

// Async Thunks (Wrapped with createAsyncThunk)
export const addAnnouncementThunk = createAsyncThunk("announcements/add", async (announcement: Omit<Announcement, "id">) => {
  return await addAnnouncement(announcement); // The function will now return the announcement after adding
});

export const updateAnnouncementThunk = createAsyncThunk("announcements/update", async (announcement: Announcement) => {
  return await updateAnnouncement(announcement); // The function will return the updated announcement
});

export const deleteAnnouncementThunk = createAsyncThunk("announcements/delete", async (id: number) => {
  await deleteAnnouncement(id); // No return value needed, just perform the delete operation
  return id; // Return the deleted announcement's id to update the state
});

// ✅ Update Redux State Immediately After Adding, Editing, or Deleting
const announcementSlice = createSlice({
  name: "announcements",
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
      // Handle Adding Announcement
      .addCase(addAnnouncementThunk.fulfilled, (state, action: PayloadAction<Announcement>) => {
        state.announcements.push(action.payload); // Add the announcement to the list
      })
      // Handle Updating Announcement
      .addCase(updateAnnouncementThunk.fulfilled, (state, action: PayloadAction<Announcement>) => {
        const index = state.announcements.findIndex((announcement) => announcement.id === action.payload.id);
        if (index !== -1) {
          state.announcements[index] = action.payload; // Update the existing announcement
        }
      })
      // Handle Deleting Announcement
      .addCase(deleteAnnouncementThunk.fulfilled, (state, action: PayloadAction<number>) => {
        state.announcements = state.announcements.filter((announcement) => announcement.id !== action.payload); // Removes the announcement from the list by ID
        state.reload = true; // Set reload to true after deleting an announcement
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

export const { triggerReload, resetReload } = announcementSlice.actions; // Export triggerReload action
export default announcementSlice.reducer;
