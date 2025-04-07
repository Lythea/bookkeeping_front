"use client";

import { useState, useRef } from "react";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import { HiDotsVertical } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/app/redux/store";
import { jsPDF } from "jspdf";
import generateReceiptPDF from "@/components/admin/export/transactionreceipt"; // Import the generateReceiptPDF function
import ViewTransactionModal from "@/components/admin/modal/transaction/ViewTransaction"; // Import the generateReceiptPDF function
import HistoryInfo from "@/components/admin/modal/transaction/transactionhistoryFilter";

import {
  addTransactionThunk,
  deleteTransactionThunk,
} from "@/app/redux/services/transactionService"; // <-- Update this to your correct path

import Status from "@/components/admin/modal/transaction/Status";

interface Inquiry {
  name: string;
  price: string;
  service: string;
}

interface Transaction {
  id: number;
  address: string;
  contact: string;
  created_at: string;
  date: string;
  email: string;
  inquiries: Inquiry[];
  name: string;
  status: string;
  transact: string;
  updated_at: string;
}

interface Props {
  transactions: Transaction[];
}

export default function TransactionsLayout({ transactions }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalTransaction, setModalTransaction] = useState<Transaction | null>(
    null
  );
  const [modalType, setModalType] = useState<"status" | "transact" | null>(
    null
  );
  const completeTransactionData = transactions.flatMap((transaction) => {
    // Flattening the inquiries into a string
    const inquiriesString = transaction.inquiries
      .map(
        (inquiry) => `${inquiry.name} (${inquiry.service}): ${inquiry.price}`
      )
      .join(", "); // You can customize the format of inquiries here

    // Return an array with each transaction's information
    return {
      id: transaction.id,
      name: transaction.name,
      address: transaction.address,
      contact: transaction.contact,
      email: transaction.email,
      created_at: transaction.created_at,
      date: transaction.date,
      status: transaction.status,
      transact: transaction.transact,
      inquiries: inquiriesString, // Display inquiries as a single string
      updated_at: transaction.updated_at,
    };
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-400 text-yellow-800";
      case "Completed":
        return "bg-green-400 text-green-800";
      case "Cancelled":
        return "bg-red-400 text-red-800";
      default:
        return "bg-gray-400 text-gray-800";
    }
  };

  const getTransactColor = (transact: string) => {
    switch (transact) {
      case "In Progress":
        return "bg-blue-400 text-blue-800";
      case "Completed":
        return "bg-green-400 text-green-800";
      case "Failed":
        return "bg-red-400 text-red-800";
      default:
        return "bg-gray-400 text-gray-800";
    }
  };

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
  const handleModalOpen = (row: Transaction, type: "status" | "transact") => {
    setModalTransaction(row);
    setModalType(type);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setModalTransaction(null);
    setModalType(null);
  };
  const columns = [
    {
      name: "Name",
      selector: (row: Transaction) => row.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row: Transaction) => row.email,
      sortable: true,
    },
    {
      name: "Contact",
      selector: (row: Transaction) => row.contact,
      sortable: true,
    },
    {
      name: "Address",
      selector: (row: Transaction) => row.address,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row: Transaction) => row.date,
      sortable: true,
    },
    {
      name: "Status",
      cell: (row: Transaction) => (
        <button
          onClick={() => handleModalOpen(row, "status")}
          className={`px-4 py-2 rounded-md font-semibold ${getStatusColor(
            row.status
          )}`}
        >
          {row.status}
        </button>
      ),
      sortable: true,
    },
    {
      name: "Transact",
      cell: (row: Transaction) => (
        <button
          onClick={() => handleModalOpen(row, "transact")}
          className={`px-4 py-2 rounded-md font-semibold ${getTransactColor(
            row.transact
          )}`}
        >
          {row.transact}
        </button>
      ),
      sortable: true,
    },

    {
      name: "Actions",
      cell: (row: Transaction) => {
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
                  className="block w-full text-left px-3 py-2 hover:bg-gray-200 text-blue-500"
                  onClick={() => {
                    setModalTransaction(row); // Set the selected transaction
                    setShowModal(true); // Show the modal
                    setMenuOpen(null); // Close the menu
                  }}
                >
                  View
                </button>
                <button
                  className="block w-full text-left px-3 py-2 hover:bg-gray-200 text-red-500"
                  onClick={() => {
                    dispatch(deleteTransactionThunk(row.id));
                    setMenuOpen(null); // Close the menu
                  }}
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

  const filteredData = transactions.filter(
    (item) => item.name.toLowerCase().includes(searchQuery.toLowerCase())
    // item.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
    // item.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
    // item.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    // item.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
    // item.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Transaction List</h2>

      <div className="mb-4 flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search transactions..."
          className="w-1/3 p-2 border rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="ml-auto flex space-x-4">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => setShowHistoryModal(true)} // Open History Modal
          >
            Transaction History
          </button>

          <CSVLink
            data={completeTransactionData}
            filename="transaction-list.csv"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Export Excel
          </CSVLink>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        striped
        highlightOnHover
        paginationPerPage={10}
      />

      {showModal && modalTransaction && modalType && (
        <Status
          transaction={modalTransaction}
          onClose={handleModalClose}
          modalType={modalType}
        />
      )}
      {showModal && modalTransaction && (
        <ViewTransactionModal
          transaction={modalTransaction}
          onClose={handleModalClose}
        />
      )}
      {showHistoryModal && (
        <HistoryInfo
          onClose={() => setShowHistoryModal(false)} // Close modal handler
          transactionNames={transactions.map((transaction) => transaction.name)} // Pass all transaction names
        />
      )}
    </div>
  );
}
