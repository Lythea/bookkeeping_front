"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import { HiDotsVertical } from "react-icons/hi";
import AddAnnouncementModal from "@/components/admin/modal/announcement/AddAnnouncement";
import EditAnnouncementModal from "@/components/admin/modal/announcement/EditAnnouncement";
import { deleteAnnouncementThunk } from "@/app/redux/slice/announcementSlice"; // Import actions
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/app/redux/store";

interface Announcement {
  id: number;
  title: string;
  description: string;
  date: string;
}

export default function AnnouncementLayout({
  announcements = [],
}: {
  announcements?: Announcement[];
}) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] =
    useState<Announcement | null>(null);

  const toggleMenu = (id: number) => {
    setMenuOpen((prev) => (prev === id ? null : id));
  };

  const handleEditAnnouncement = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setIsEditModalOpen(true);
  };

  const handleDeleteAnnouncement = (announcement: Announcement) => {
    setAnnouncementToDelete(announcement);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteAnnouncement = async () => {
    if (announcementToDelete) {
      try {
        // Dispatch the delete action
        await dispatch(deleteAnnouncementThunk(announcementToDelete.id));

        // After deleting, trigger a page refresh to re-fetch the data
        router.refresh();
        setIsDeleteModalOpen(false);
        setAnnouncementToDelete(null);
      } catch (error) {
        console.error("Error deleting announcement:", error);
      }
    }
  };

  const filteredData =
    (Array.isArray(announcements) ? announcements : []).filter((item) => {
      const query = searchQuery.toLowerCase();
      return (
        item.title?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.date?.toLowerCase().includes(query)
      );
    }) || [];

  const columns = [
    {
      name: "Title",
      selector: (row: Announcement) => row.title,
      sortable: true,
    },
    { name: "Description", selector: (row: Announcement) => row.description },
    { name: "Date", selector: (row: Announcement) => row.date, sortable: true },
    {
      name: "Actions",
      cell: (row: Announcement) => (
        <div className="relative">
          <button
            onClick={() => toggleMenu(row.id)}
            className="text-gray-600 hover:text-gray-900"
          >
            <HiDotsVertical size={20} />
          </button>
          {menuOpen === row.id && (
            <div className="fixed min-w-[100px] bg-white shadow-md rounded-md z-50">
              <button
                className="block w-full text-left px-3 py-2 hover:bg-gray-200"
                onClick={() => handleEditAnnouncement(row)}
              >
                Edit
              </button>
              <button
                className="block w-full text-left px-3 py-2 hover:bg-red-200 text-red-500"
                onClick={() => handleDeleteAnnouncement(row)}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Announcement List</h2>
      <div className="mb-4 flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search announcements..."
          className="w-1/3 p-2 border rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />  
        <div className="ml-auto flex space-x-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Announcement
          </button>
          <CSVLink
            data={filteredData}
            filename="announcement-list.csv"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Export Excel
          </CSVLink>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        striped
        highlightOnHover
        paginationPerPage={10}
      />
      <AddAnnouncementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <EditAnnouncementModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        announcement={selectedAnnouncement}
      />
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p>
              Are you sure you want to delete{" "}
              <strong>{announcementToDelete?.title}</strong>?
            </p>
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAnnouncement}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
