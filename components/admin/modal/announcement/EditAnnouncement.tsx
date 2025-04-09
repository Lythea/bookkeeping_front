"use client";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store";
import { updateAnnouncementThunk } from "@/app/redux/slice/announcementSlice"; // Import actions
import { useRouter } from "next/navigation";
interface EditAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcement: {
    id: number;
    title: string;
    description: string;
    date: string;
  } | null;
}

export default function EditAnnouncementModal({
  isOpen,
  onClose,
  announcement,
}: EditAnnouncementModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const router = useRouter();
  useEffect(() => {
    if (announcement) {
      setTitle(announcement.title);
      setDescription(announcement.description);
      setDate(announcement.date);
    }
  }, [announcement]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (announcement) {
      try {
        const updatedAnnouncement = {
          id: announcement.id,
          title,
          description,
          date,
        };
        await dispatch(updateAnnouncementThunk(updatedAnnouncement));
        router.refresh();
        onClose(); // Close the modal after editing the announcement
      } catch (error) {
        console.error("Error editing announcement:", error);
      }
    }
  };

  if (!isOpen || !announcement) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h3 className="text-lg font-semibold mb-4">Edit Announcement</h3>
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
