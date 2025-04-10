const API_URL = process.env.NEXT_PUBLIC_API_URL + "/api/announcements"; // Use the environment variable
import Cookies from "universal-cookie"; // Import Cookies for retrieving the token
import { showToast } from "@/components/toast"; // Import toast

interface Announcement {
  id: number;
  title: string;
  description: string;
  date: string;
}

const cookies = new Cookies(); // Create an instance to read cookies
const getAuthHeaders = () => {
  const token = cookies.get("authToken");
  if (!token) {
    throw new Error("User is not authenticated");
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`, // Add the auth token to the Authorization header
  };
};

export const fetchAnnouncements = async () => {
  try {
    const response = await fetch(API_URL, {
      credentials: "include", // Make sure cookies are sent
    });
    if (!response.ok) throw new Error("Failed to fetch announcements");
    return response.json();
  } catch (error) {
    showToast("Failed to fetch announcements", "error");
    throw error;
  }
};

export const getAnnouncement = async (id: number) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      credentials: "include", // Make sure cookies are sent
    });
    if (!response.ok) throw new Error("Failed to fetch announcement");
    return response.json();
  } catch (error) {
    showToast("Failed to fetch announcement", "error");
    throw error;
  }
};

export const addAnnouncement = async (announcement: Omit<Announcement, "id">) => {
  try {

    const response = await fetch(API_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(announcement),
      credentials: "include", // Make sure cookies are sent
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to add announcement:", errorText);
      throw new Error(errorText);
    }

    const data = await response.json();

    showToast("Announcement added successfully!", "success");
    return data;
  } catch (error) {
    showToast("Failed to add announcement", "error");
    throw error;
  }
};

export const updateAnnouncement = async (announcement: Announcement) => {
  try {
    const response = await fetch(`${API_URL}/${announcement.id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(announcement),
      credentials: "include", // Make sure cookies are sent
    });

    if (!response.ok) throw new Error("Failed to update announcement");

    showToast("Announcement updated successfully!", "success");
    return response.json();
  } catch (error) {
    showToast("Failed to update announcement", "error");
    throw error;
  }
};

export const deleteAnnouncement = async (id: number) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
      credentials: "include", // Make sure cookies are sent
    });

    if (!response.ok) throw new Error("Failed to delete announcement");

    showToast("Announcement deleted successfully!", "success");
    return id; // Returning the ID for potential state updates
  } catch (error) {
    showToast("Failed to delete announcement", "error");
    throw error;
  }
};
