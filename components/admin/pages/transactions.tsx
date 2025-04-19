"use client";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import DataTable from "react-data-table-component";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store";
import { HiDotsVertical } from "react-icons/hi";

import AddModal from "@/components/admin/modal/transaction/AddModal";
import { deleteTransactionThunk } from "@/app/redux/services/transactionService";
import StatusModal from "@/components/admin/modal/transaction/Status";
import ViewTransaction from "@/components/admin/modal/transaction/ViewTransaction";
import TransactionHistory from "@/components/admin/modal/transaction/transactionhistoryFilter";
interface Inquiry {
  name: string;
  price: string;
  service: string;
}
interface Transaction {
  id: number;
  name: string; // Full name of the client
  status: string;
  date: string;
  inquiries: Inquiry[];
  tin_id: string;
  business_name: string;
}

interface Props {
  transactions: { transactions: Transaction[]; clients: any; services: any };
}

export default function TransactionsLayout({ transactions }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const [statusModalTransaction, setStatusModalTransaction] =
    useState<Transaction | null>(null);
  const [viewTransaction, setViewTransaction] = useState<Transaction | null>(
    null
  );
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false); // Add state for history modal

  console.log(transactions.transactions);
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const toggleMenu = (id: number) => {
    setMenuOpen(menuOpen === id ? null : id);
  };

  const handleDeleteClient = async (row: any) => {
    setConfirmDelete(row.id);
    setMenuOpen(null);
  };

  const confirmDeletion = async () => {
    if (confirmDelete !== null) {
      await dispatch(deleteTransactionThunk(confirmDelete));
      setConfirmDelete(null);
      router.refresh();
    }
  };

  const cancelDeletion = () => {
    setConfirmDelete(null);
  };
  const handleHistoryModalOpen = () => {
    setIsHistoryModalOpen(true);
  };
  const handleStatusClick = (transaction: Transaction) => {
    setStatusModalTransaction(transaction);
    setMenuOpen(null);
  };
  const handleViewTransaction = (transaction: Transaction) => {
    setViewTransaction(transaction);
    setMenuOpen(null);
  };

  const tableData = useMemo(() => {
    if (!Array.isArray(transactions.transactions)) return [];

    const filteredData = transactions.transactions.filter((txn: Transaction) =>
      txn.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return filteredData.map((txn: Transaction) => ({
      id: txn.id,
      name: txn.name,
      status: txn.status,
      date: txn.date,
      inquiries: txn.inquiries,
      inquiriesDisplay: txn.inquiries
        .map(
          (inquiry: Inquiry) =>
            `${inquiry.service}: ${inquiry.name} - ₱${inquiry.price}`
        )
        .join(", "),
      price: txn.inquiries
        .map((inquiry: Inquiry) => `₱${inquiry.price}`)
        .join(", "),
      business_name: txn.business_name, // ➕ Added
      tin_id: txn.tin_id, // ➕ Added
    }));
  }, [transactions.transactions, searchQuery]);

  const columns = [
    {
      name: "Client",
      selector: (row: any) => row.name,
      sortable: true,
    },
    {
      name: "TIN ID",
      selector: (row: any) => row.tin_id,
      sortable: true,
    },
    {
      name: "Business Name",
      selector: (row: any) => row.business_name,
      sortable: true,
    },

    {
      name: "Inquiries",
      selector: (row: any) => row.inquiriesDisplay || "No inquiries",
      sortable: true,
      wrap: true,
    },
    {
      name: "Status",
      selector: (row: any) => row.status,
      cell: (row: any) => {
        const status = row.status.toLowerCase();
        const statusColor =
          status === "pending"
            ? "bg-yellow-100 text-yellow-800"
            : status === "completed"
            ? "bg-blue-100 text-blue-800"
            : "bg-red-100 text-red-800";

        return (
          <button
            onClick={() => handleStatusClick(row)}
            className={`px-2 py-1 rounded text-sm font-semibold ${statusColor}`}
          >
            {row.status.toUpperCase()}
          </button>
        );
      },
    },

    {
      name: "Date",
      selector: (row: any) => row.date,
    },
    {
      name: "Actions",
      cell: (row: any) => (
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
                className="block w-full text-left px-3 py-2 hover:bg-blue-200 text-blue-500"
                onClick={() => handleViewTransaction(row)}
              >
                View Transaction
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
      wrap: false,
    },
  ];

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Transactions</h1>

      {/* Search and Add Button */}
      <div className="mb-4 flex items-center justify-between">
        <input
          type="text"
          placeholder="Search by client name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md w-1/4"
        />
        <div className="ml-auto flex space-x-4">
          {" "}
          {/* Add ml-auto to push buttons to the right */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Add Transaction
          </button>
          <button
            onClick={handleHistoryModalOpen} // Trigger history modal
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Transaction History
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={tableData}
        pagination
        highlightOnHover
        striped
        responsive
      />

      {viewTransaction && (
        <ViewTransaction
          clients={transactions.clients}
          transaction={viewTransaction}
          onClose={() => setViewTransaction(null)}
        />
      )}
      {isHistoryModalOpen && (
        <TransactionHistory
          clients={transactions.clients} // Pass clients to modal
          transactions={transactions.transactions}
          onClose={() => setIsHistoryModalOpen(false)} // Close the modal
        />
      )}
      {isAddModalOpen && (
        <AddModal
          onClose={() => setIsAddModalOpen(false)}
          clients={transactions.clients}
          services={transactions.services}
          onSuccess={() => router.refresh()}
        />
      )}
      {statusModalTransaction && (
        <StatusModal
          transaction={statusModalTransaction}
          onClose={() => setStatusModalTransaction(null)}
        />
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-md shadow-lg">
            <p>Are you sure you want to delete this transaction?</p>
            <div className="mt-4 flex justify-between">
              <button
                onClick={cancelDeletion}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeletion}
                className="px-4 py-2 bg-red-600 text-white rounded-md"
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
