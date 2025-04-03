"use client";

import { useState, useRef } from "react";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv"; // For exporting Excel
import { HiDotsVertical } from "react-icons/hi"; // Importing the 3-dot menu icon

interface Transaction {
  id: number;
  transactionId: string;
  clientName: string;
  service: string;
  amount: string;
  date: string;
  paymentMethod: string;
  status: string;
}

const data: Transaction[] = [
  {
    id: 1,
    transactionId: "TXN123456",
    clientName: "John Doe",
    service: "BIR Processing",
    amount: "$1000",
    date: "2025-03-25",
    paymentMethod: "Credit Card",
    status: "Completed",
  },
  {
    id: 2,
    transactionId: "TXN789012",
    clientName: "Jane Smith",
    service: "SEO Optimization",
    amount: "$500",
    date: "2025-03-24",
    paymentMethod: "PayPal",
    status: "Pending",
  },
];

export default function TransactionsLayout() {
  const [searchQuery, setSearchQuery] = useState(""); // State for search filter
  const [menuOpen, setMenuOpen] = useState<number | null>(null); // State to track open menu by row ID

  // Define toggleMenu to toggle the visibility of the action menu
  const toggleMenu = (
    id: number,
    buttonRef: React.RefObject<HTMLButtonElement | null>
  ) => {
    // Toggle the menu for the clicked row, close any other open menus
    setMenuOpen((prev) => (prev === id ? null : id)); // If same row clicked, close, otherwise open new one

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdown = document.getElementById(`dropdown-${id}`);
      if (dropdown) {
        dropdown.style.top = `${rect.bottom + window.scrollY}px`; // Position below the button
        dropdown.style.left = `${rect.left + window.scrollX}px`; // Align with the button's left side
      }
    }
  };
  const columns = [
    {
      name: "Transaction ID",
      selector: (row: Transaction) => row.transactionId,
      sortable: true,
    },
    {
      name: "Client Name",
      selector: (row: Transaction) => row.clientName,
      sortable: true,
    },
    {
      name: "Service",
      selector: (row: Transaction) => row.service,
      sortable: true,
    },
    {
      name: "Amount",
      selector: (row: Transaction) => row.amount,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row: Transaction) => row.date,
      sortable: true,
    },
    {
      name: "Payment Method",
      selector: (row: Transaction) => row.paymentMethod,
    },
    {
      name: "Status",
      selector: (row: Transaction) => row.status,
      sortable: true,
    },
    {
      name: "Actions", // New Action column
      cell: (row: Transaction) => {
        const buttonRef = useRef<HTMLButtonElement>(null); // Create ref for the button
        return (
          <div className="relative">
            <button
              ref={buttonRef} // Attach ref to the button
              onClick={() => toggleMenu(row.id, buttonRef)} // Pass ref to toggleMenu
              className="text-gray-600 hover:text-gray-900"
            >
              <HiDotsVertical size={20} />
            </button>
            {menuOpen === row.id && ( // Only show the menu if this row's menu is open
              <div
                id={`dropdown-${row.id}`} // Add an ID to easily target the dropdown
                className="fixed min-w-[100px] bg-white shadow-md rounded-md z-50"
              >
                <button
                  className="block w-full text-left px-3 py-2 hover:bg-gray-200"
                  onClick={() => alert(`Editing ${row}`)}
                >
                  Edit
                </button>
                <button
                  className="block w-full text-left px-3 py-2 hover:bg-gray-200 text-red-500"
                  onClick={() => alert(`Deleting ${row}`)}
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

  // Filtered data based on the search query
  const filteredData = data.filter(
    (item) =>
      item.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.amount.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to handle Edit action
  const handleEdit = (row: Transaction) => {
    alert(`Editing transaction ${row.transactionId}`);
    // You can later integrate form modal or logic to edit this transaction.
  };

  // Function to handle Delete action
  const handleDelete = (row: Transaction) => {
    if (
      window.confirm(`Are you sure you want to delete ${row.transactionId}?`)
    ) {
      alert(`Deleting transaction ${row.transactionId}`);
      // Add the delete logic here (e.g., delete the record from the state or database).
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Transaction List</h2>

      {/* Search Input */}
      <div className="mb-4 flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search transactions..."
          className="w-1/3 p-2 border rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Buttons Inline - Right Aligned */}
        <div className="ml-auto flex space-x-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Add Transaction
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Export PDF
          </button>

          {/* Export Excel Button */}
          <CSVLink
            data={filteredData}
            filename="transaction-list.csv"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Export Excel
          </CSVLink>
        </div>
      </div>

      {/* DataTable with Pagination and Search Filter */}
      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        striped
        highlightOnHover
        paginationPerPage={10} // Number of rows per page
      />
    </div>
  );
}
