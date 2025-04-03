"use client";

import { useState, useRef } from "react";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv"; // For exporting Excel
import { jsPDF } from "jspdf"; // For exporting PDF
import "jspdf-autotable"; // Importing the jsPDF autotable plugin
import { HiDotsVertical } from "react-icons/hi"; // Importing the 3-dot menu icon

interface Inquiry {
  id: number;
  service: string;
  form: string;
  clientName: string;
  date: string;
  address: string;
  contactNumber: string;
  email: string;
  status: string;
}

const data: Inquiry[] = [
  {
    id: 1,
    service: "BIR",
    form: "Form 137",
    clientName: "John Doe",
    date: "2025-03-25",
    address: "123 Main St, City, Country",
    contactNumber: "123-456-7890",
    email: "johndoe@example.com",
    status: "Pending",
  },
  {
    id: 2,
    service: "SEO Optimization",
    form: "Consultation",
    clientName: "Jane Smith",
    date: "2025-03-24",
    address: "456 Elm St, City, Country",
    contactNumber: "987-654-3210",
    email: "janesmith@example.com",
    status: "Completed",
  },
];

export default function InquiriesLayout() {
  const [menuOpen, setMenuOpen] = useState<number | null>(null); // Track only one menu at a time
  const [searchQuery, setSearchQuery] = useState("");

  const columns = [
    {
      name: "Service",
      selector: (row: Inquiry) => row.service,
      sortable: true,
    },
    {
      name: "Form",
      selector: (row: Inquiry) => row.form,
    },
    {
      name: "Client Name",
      selector: (row: Inquiry) => row.clientName,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row: Inquiry) => row.date,
      sortable: true,
    },
    {
      name: "Address",
      selector: (row: Inquiry) => row.address,
    },
    {
      name: "Contact Number",
      selector: (row: Inquiry) => row.contactNumber,
    },
    {
      name: "Email",
      selector: (row: Inquiry) => row.email,
    },
    {
      name: "Status",
      selector: (row: Inquiry) => row.status,
      sortable: true,
    },
    {
      name: "Actions", // New Action column
      cell: (row: Inquiry) => {
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
                  onClick={() => alert(`Editing ${row.id}`)}
                >
                  Edit
                </button>
                <button
                  className="block w-full text-left px-3 py-2 hover:bg-gray-200 text-red-500"
                  onClick={() => alert(`Deleting ${row.id}`)}
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

  // Filtered data based on the search query
  const filteredData = data.filter(
    (item) =>
      item.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.form.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.contactNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to export the table as PDF

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Inquiries List</h2>

      {/* Search Input */}
      <div className="mb-4 flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search inquiries..."
          className="w-1/3 p-2 border rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Buttons Inline - Right Aligned */}
        <div className="ml-auto flex space-x-4">
          {/* Add Inquiry Button */}
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Add Inquiry
          </button>

          {/* Export PDF Button */}
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Export PDF
          </button>

          {/* Export Excel Button */}
          <CSVLink
            data={filteredData}
            filename="inquiry-list.csv"
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
