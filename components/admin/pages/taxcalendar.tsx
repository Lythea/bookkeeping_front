"use client";

import { useState, useRef } from "react";
import DataTable from "react-data-table-component";
import { HiDotsVertical } from "react-icons/hi";
import AddTaxCalendar from "@/components/admin/modal/taxcalendar/AddTaxCalendar"; // Import the modal
import EditTaxCalendar from "@/components/admin/modal/taxcalendar/EditTaxCalendar"; // Import the modal
import { deleteTaxFormThunk } from "@/app/redux/slice/taxcalendarSlice"; // Import actions
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/app/redux/store";
import { useRouter } from "next/navigation";

interface TaxForm {
  id: number; // This will be the primary key that the backend generates
  form_no: string; // form_no corresponds to 'form_no' in the backend validation
  latest_revision_date: string; // latest_revision_date corresponds to 'latest_revision_date' in the backend validation
  form_name: string; // form_name corresponds to 'form_name' in the backend validation
  due_date: string; // due_date corresponds to 'due_date' in the backend validation
}

interface TaxCalendarProps {
  events: TaxForm[];
}

const TaxCalendarLayout: React.FC<TaxCalendarProps> = ({ events }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter(); // To trigger page refresh when necessary

  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for delete confirmation modal
  const [taxFormToDelete, setTaxFormToDelete] = useState<TaxForm | null>(null); // State for tax form to delete
  const [selectedTaxCalendar, setSelectedTaxCalendar] =
    useState<TaxForm | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const toggleMenu = (
    id: number,
    buttonRef: React.RefObject<HTMLButtonElement | null>
  ) => {
    setMenuOpen((prev) => (prev === id ? null : id));

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdown = document.getElementById(`dropdown-${id}`);
      if (dropdown) {
        dropdown.style.top = `${rect.bottom + window.scrollY}px`;
        dropdown.style.left = `${rect.left + window.scrollX}px`;
      }
    }
  };

  const handleEditClient = (taxcalendar: TaxForm) => {
    setSelectedTaxCalendar(taxcalendar); // Set the selected tax form for editing
    setIsEditModalOpen(true); // Open the edit modal
  };

  const handleAddTaxFormClick = () => {
    setIsModalOpen(true);
  };

  const handleDeleteTaxForm = (taxForm: TaxForm) => {
    setTaxFormToDelete(taxForm);
    setIsDeleteModalOpen(true); // Open the delete confirmation modal
  };

  const confirmDeleteTaxForm = async () => {
    if (taxFormToDelete) {
      try {
        // Dispatch the delete action
        await dispatch(deleteTaxFormThunk(taxFormToDelete.id));

        // After deleting, trigger a page refresh to re-fetch the data
        router.refresh(); // This will refresh the page to fetch updated data from the server
        setIsDeleteModalOpen(false);
        setTaxFormToDelete(null);
      } catch (error) {
        console.error("Error deleting client:", error);
      }
    }
  };

  const columns = [
    {
      name: "Form No.",
      selector: (row: TaxForm) => row.form_no,
      sortable: true,
    },
    {
      name: "Latest Revision Date",
      selector: (row: TaxForm) => row.latest_revision_date,
      sortable: true,
    },
    {
      name: "Form Name",
      selector: (row: TaxForm) => row.form_name,
    },
    {
      name: "Due Date",
      selector: (row: TaxForm) => row.due_date,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row: TaxForm) => {
        const buttonRef = useRef<HTMLButtonElement>(null);
        return (
          <div className="relative">
            <button
              ref={buttonRef}
              onClick={() => toggleMenu(row.id, buttonRef)}
              className="text-gray-600 hover:text-gray-900"
            >
              <HiDotsVertical size={20} />
            </button>
            {menuOpen === row.id && (
              <div
                id={`dropdown-${row.id}`}
                className="fixed min-w-[100px] bg-white shadow-md rounded-md z-50"
              >
                <button
                  className="block w-full text-left px-3 py-2 hover:bg-gray-200"
                  onClick={() => handleEditClient(row)} // Open edit modal
                >
                  Edit
                </button>
                <button
                  className="block w-full text-left px-3 py-2 hover:bg-gray-200 text-red-500"
                  onClick={() => handleDeleteTaxForm(row)} // Trigger the delete modal
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Tax Calendar</h2>

      {/* Search Input and Buttons Inline */}
      <div className="flex items-center mb-4 space-x-4 w-full">
        <input
          type="text"
          placeholder="Search services or forms..."
          className="w-1/3 p-2 border rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="ml-auto flex space-x-4">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleAddTaxFormClick} // Open modal when clicked
          >
            Add Tax Calendar
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={events.filter(
          (item) =>
            (item.form_name
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ??
              false) ||
            (item.form_no?.toLowerCase().includes(searchQuery.toLowerCase()) ??
              false)
        )}
        pagination
        striped
        highlightOnHover
      />

      <AddTaxCalendar
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <EditTaxCalendar
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        taxcalendar={selectedTaxCalendar} // Pass the selected tax form for editing
      />
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p>
              Are you sure you want to delete the tax form{" "}
              <strong>{taxFormToDelete?.form_name}</strong>?
            </p>
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteTaxForm}
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
};

export default TaxCalendarLayout;
