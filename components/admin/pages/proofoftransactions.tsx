"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import { HiDotsVertical } from "react-icons/hi";
import AddProofOfTransactionModal from "@/components/admin/modal/proofoftransaction/AddProof";
import EditProofOfTransactionModal from "@/components/admin/modal/proofoftransaction/EditProof";
import { deleteProofOfTransactionThunk } from "@/app/redux/slice/proofoftransactionSlice"; // Import actions
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/app/redux/store";

interface ProofOfTransaction {
  id: number;
  title: string;
  description: string;
  type: "image" | "video" | "embed"; // Limit type to accepted values
  content: string;
}

export default function ProofOfTransactionLayout({
  proofOfTransactions = [],
}: {
  proofOfTransactions?: ProofOfTransaction[];
}) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProofOfTransaction, setSelectedProofOfTransaction] =
    useState<ProofOfTransaction | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [proofToDelete, setProofToDelete] = useState<ProofOfTransaction | null>(
    null
  );

  const toggleMenu = (id: number) => {
    setMenuOpen((prev) => (prev === id ? null : id));
  };

  const handleEditProofOfTransaction = (proof: ProofOfTransaction) => {
    setSelectedProofOfTransaction(proof);
    setIsEditModalOpen(true);
  };

  const handleDeleteProofOfTransaction = (proof: ProofOfTransaction) => {
    setProofToDelete(proof);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteProofOfTransaction = async () => {
    if (proofToDelete) {
      try {
        // Dispatch the delete action
        await dispatch(deleteProofOfTransactionThunk(proofToDelete.id));

        // After deleting, trigger a page refresh to re-fetch the data
        router.refresh();
        setIsDeleteModalOpen(false);
        setProofToDelete(null);
      } catch (error) {
        console.error("Error deleting proof of transaction:", error);
      }
    }
  };

  const filteredData =
    (Array.isArray(proofOfTransactions) ? proofOfTransactions : []).filter(
      (item) => {
        const query = searchQuery.toLowerCase();
        return (
          item.title?.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.type?.toLowerCase().includes(query)
        );
      }
    ) || [];

  const columns = [
    {
      name: "Title",
      selector: (row: ProofOfTransaction) => row.title,
      sortable: true,
      style: { width: "200px" }, // Add width for this column
    },
    {
      name: "Description",
      selector: (row: ProofOfTransaction) => row.description,
      style: { width: "300px" }, // Add width for this column
    },
    {
      name: "Type",
      selector: (row: ProofOfTransaction) => row.type,
      style: { width: "150px" }, // Add width for this column
    },
    {
      name: "Content",
      selector: (row: ProofOfTransaction) => row.content,
      style: { width: "250px" }, // Add width for this column
    },
    {
      name: "Actions",
      cell: (row: ProofOfTransaction) => (
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
                onClick={() => handleEditProofOfTransaction(row)}
              >
                Edit
              </button>
              <button
                className="block w-full text-left px-3 py-2 hover:bg-red-200 text-red-500"
                onClick={() => handleDeleteProofOfTransaction(row)}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ),
      style: { width: "120px" }, // Add width for this column
    },
  ];

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Proof of Transaction List</h2>
      <div className="mb-4 flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search proof of transaction..."
          className="w-1/3 p-2 border rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="ml-auto flex space-x-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Proof of Transaction
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
      <AddProofOfTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <EditProofOfTransactionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        proofOfTransaction={selectedProofOfTransaction}
      />
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p>
              Are you sure you want to delete{" "}
              <strong>{proofToDelete?.title}</strong>?
            </p>
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteProofOfTransaction}
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
