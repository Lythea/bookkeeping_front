"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DataTable from "react-data-table-component";
import { HiDotsVertical } from "react-icons/hi";
import AddTaxCalendar from "@/components/admin/modal/taxcalendar/AddTaxCalendar";
import EditTaxCalendar from "@/components/admin/modal/taxcalendar/EditTaxCalendar";
import { deleteTaxFormThunk } from "@/app/redux/slice/taxcalendarSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store";

interface TaxForm {
  id: number;
  form_no: string;
  due_date: string;
  frequency: string;
}

interface TaxCalendarLayoutProps {
  events: {
    services: unknown;
    events: TaxForm[];
  };
}
const TaxCalendarLayout: React.FC<TaxCalendarLayoutProps> = ({ events }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal for adding
  const [selectedTaxForm, setSelectedTaxForm] = useState<TaxForm | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Edit modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taxFormToDelete, setTaxFormToDelete] = useState<TaxForm | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  console.log(events.services);

  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "2-digit",
    };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  const confirmDeleteTaxForm = async () => {
    if (taxFormToDelete) {
      try {
        await dispatch(deleteTaxFormThunk(taxFormToDelete.id));
        router.refresh();
        setIsDeleteModalOpen(false);
        setTaxFormToDelete(null);
      } catch (error) {
        console.error("Error deleting tax form:", error);
      }
    }
  };

  const filteredData = events.events.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.form_no.toLowerCase().includes(query) ||
      item.frequency.toLowerCase().includes(query) ||
      item.due_date.toLowerCase().includes(query)
    );
  });

  const columns = [
    { name: "Form No.", selector: (row: TaxForm) => row.form_no, wrap: true },
    {
      name: "Frequency",
      selector: (row: TaxForm) => row.frequency,
      wrap: true,
    },
    {
      name: "Due Date",
      selector: (row: TaxForm) => formatDate(row.due_date),
      wrap: true,
    },
    {
      name: "Actions",
      cell: (row: TaxForm) => (
        <div className="relative">
          <button
            onClick={() => setMenuOpen(menuOpen === row.id ? null : row.id)}
            className="text-gray-600 hover:text-gray-900"
          >
            <HiDotsVertical size={20} />
          </button>
          {menuOpen === row.id && (
            <div className="fixed min-w-[100px] bg-white shadow-md rounded-md z-50">
              <button
                className="block w-full text-left px-3 py-2 hover:bg-gray-200"
                onClick={() => {
                  setSelectedTaxForm(row); // Set selected form for editing
                  setIsEditModalOpen(true);
                }}
              >
                Edit
              </button>
              <button
                className="block w-full text-left px-3 py-2 hover:bg-red-200 text-red-500"
                onClick={() => {
                  setTaxFormToDelete(row);
                  setIsDeleteModalOpen(true);
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ),
      wrap: false,
    },
  ];

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Tax Calendar</h2>
      <div className="mb-4 flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search tax forms..."
          className="w-1/3 p-2 border rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="ml-auto flex space-x-4">
          <button
            onClick={() => {
              setSelectedTaxForm(null); // Reset selectedTaxForm when adding
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Tax Form
          </button>
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
      <AddTaxCalendar
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        services={events.services}
      />
      <EditTaxCalendar
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        taxForm={selectedTaxForm}
        services={events.services}
      />

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p>
              Are you sure you want to delete{" "}
              <strong>{taxFormToDelete && taxFormToDelete.form_no}</strong>?
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
