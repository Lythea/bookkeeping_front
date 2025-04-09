"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store";
import { addAnnouncementThunk } from "@/app/redux/slice/announcementSlice"; // Import actions
import { useRouter } from "next/navigation";
interface AddAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddAnnouncementModal({
  isOpen,
  onClose,
}: AddAnnouncementModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newAnnouncement = { title, description, date };
      await dispatch(addAnnouncementThunk(newAnnouncement));
      router.refresh();
      onClose(); // Close the modal after adding the announcement
    } catch (error) {
      console.error("Error adding announcement:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h3 className="text-lg font-semibold mb-4">Add Announcement</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold">Title</label>
            <input
              type="text"
              className="w-full p-2 border rounded mt-1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold">Description</label>
            <textarea
              className="w-full p-2 border rounded mt-1"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold">Date</label>
            <input
              type="date"
              className="w-full p-2 border rounded mt-1"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="mt-4 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
