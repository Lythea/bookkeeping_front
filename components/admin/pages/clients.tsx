"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import { HiDotsVertical } from "react-icons/hi";
import AddClientModal from "@/components/admin/modal/client/AddClient";
import EditClientModal from "@/components/admin/modal/client/EditClient";
import { deleteClientThunk } from "@/app/redux/slice/clientSlice"; // Import actions
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/app/redux/store";

interface Client {
  id: number;
  name: string;
  phone: string;
  address: string;
  business_type: string;
  business_name: string;
  tin_id: string;
}

export default function ClientLayout({ clients = [] }: { clients?: Client[] }) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter(); // To trigger page refresh when necessary

  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  const toggleMenu = (id: number) => {
    setMenuOpen((prev) => (prev === id ? null : id));
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setIsEditModalOpen(true);
  };

  const handleDeleteClient = (client: Client) => {
    setClientToDelete(client);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteClient = async () => {
    if (clientToDelete) {
      try {
        // Dispatch the delete action
        await dispatch(deleteClientThunk(clientToDelete.id));

        // After deleting, trigger a page refresh to re-fetch the data
        router.refresh(); // This will refresh the page to fetch updated data from the server
        setIsDeleteModalOpen(false);
        setClientToDelete(null);
      } catch (error) {
        console.error("Error deleting client:", error);
      }
    }
  };

  const filteredData =
    clients?.filter((item) => {
      const query = searchQuery.toLowerCase();
      return (
        item.name?.toLowerCase().includes(query) ||
        item.phone?.toLowerCase().includes(query) ||
        item.address?.toLowerCase().includes(query) ||
        item.business_type?.toLowerCase().includes(query) ||
        item.business_name?.toLowerCase().includes(query) ||
        item.tin_id?.toLowerCase().includes(query)
      );
    }) || [];

  const columns = [
    { name: "Name", selector: (row: Client) => row.name, sortable: true },
    {
      name: "Phone Number",
      selector: (row: Client) => row.phone,
      sortable: true,
    },
    { name: "Address", selector: (row: Client) => row.address },
    {
      name: "Business Type",
      selector: (row: Client) => row.business_type,
      sortable: true,
    },
    { name: "Business Name", selector: (row: Client) => row.business_name },
    { name: "TIN ID", selector: (row: Client) => row.tin_id },
    {
      name: "Actions",
      cell: (row: Client) => (
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
                onClick={() => handleEditClient(row)}
              >
                Edit
              </button>
              <button
                className="block w-full text-left px-3 py-2 hover:bg-red-200 text-red-500"
                onClick={() => handleDeleteClient(row)}
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
      <h2 className="text-2xl font-semibold mb-4">Client List</h2>
      <div className="mb-4 flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search clients..."
          className="w-1/3 p-2 border rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="ml-auto flex space-x-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Client
          </button>
          <CSVLink
            data={filteredData}
            filename="client-list.csv"
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
      <AddClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <EditClientModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        client={selectedClient}
      />
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p>
              Are you sure you want to delete{" "}
              <strong>{clientToDelete?.name}</strong>?
            </p>
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteClient}
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
