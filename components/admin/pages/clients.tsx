"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DataTable from "react-data-table-component";
import { HiDotsVertical } from "react-icons/hi";
import AddClientModal from "@/components/admin/modal/client/AddClient";
import EditClientModal from "@/components/admin/modal/client/EditClient";
import { deleteClientThunk } from "@/app/redux/slice/clientSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store";

export interface Business {
  business_name: string;
  line_of_business: string;
  registered_address: string;
  started_date: string;
  tin: string;
  zip_code: string;
}

export interface Client {
  id: number;
  firstname: string;
  lastname: string;
  middlename: string | null;
  birthday: string;
  email: string | null;
  contact_number: string | null;
  business: Business[];
}

interface ClientPropType {
  clients?: Client[] | { data: Client[] };
}

export default function ClientLayout({ clients }: ClientPropType) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  console.log(clients);

  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [searchColumn, setSearchColumn] = useState<string>("firstname");

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
        await dispatch(deleteClientThunk(clientToDelete.id));
        router.refresh();
        setIsDeleteModalOpen(false);
        setClientToDelete(null);
      } catch (error) {
        console.error("Error deleting client:", error);
      }
    }
  };

  const formatBirthday = (birthday: string) => {
    const date = new Date(birthday);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    }).format(date);
  };

  const formatName = (row: Client) => {
    return `${row.lastname.toUpperCase()}, ${row.firstname.toUpperCase()} ${
      row.middlename ? row.middlename.toUpperCase() : ""
    }`;
  };

  const clientArray: Client[] = Array.isArray(clients)
    ? clients
    : (clients as any)?.data ?? [];

  const filteredData = clientArray.filter((item) => {
    const query = searchQuery.toLowerCase();
    const business = item.business?.[0];

    switch (searchColumn) {
      case "firstname":
        return item.firstname.toLowerCase().includes(query);
      case "lastname":
        return item.lastname.toLowerCase().includes(query);
      case "middlename":
        return item.middlename?.toLowerCase().includes(query);
      case "birthday":
        return item.birthday.toLowerCase().includes(query);
      case "email":
        return item.email?.toLowerCase().includes(query);
      case "contact_number":
        return item.contact_number?.includes(query);
      case "business_name":
        return business?.business_name.toLowerCase().includes(query);
      case "registered_address":
        return business?.registered_address.toLowerCase().includes(query);
      case "line_of_business":
        return business?.line_of_business.toLowerCase().includes(query);
      case "tin":
        return business?.tin.toLowerCase().includes(query);
      case "zip_code":
        return business?.zip_code.toLowerCase().includes(query);
      default:
        return false;
    }
  });

  const columns = [
    {
      name: "Name",
      selector: (row: Client) => formatName(row),
      sortable: true,
      wrap: true,
      width: "10%",
    },
    {
      name: "Birthday",
      selector: (row: Client) => formatBirthday(row.birthday),
      wrap: true,
      width: "6%",
    },
    {
      name: "Business Details",
      width: "60%",
      cell: (row: Client) => {
        const businesses = row.business;
        const businessCount = businesses?.length ?? 0;

        // Compute gridCols based on businessCount
        let gridCols = "grid-cols-1";
        if (businessCount === 2) gridCols = "grid-cols-2";
        else if (businessCount >= 3) gridCols = "grid-cols-3";

        if (businesses && businessCount > 0) {
          return (
            <div className={`space-y-2 grid ${gridCols} gap-4`}>
              {businesses.map((b, index) => (
                <div key={index} className="p-2 border-b space-y-2">
                  {/* First Column */}
                  <div className="text-sm text-gray-600">
                    <div>
                      <strong>TIN ID:</strong> {b.tin}
                    </div>
                    <div>
                      <strong>Business Name:</strong> {b.business_name}
                    </div>
                    <div>
                      <strong>Line of Business:</strong> {b.line_of_business}
                    </div>
                  </div>

                  {/* Second Column */}
                  <div className="text-sm text-gray-600">
                    <div>
                      <strong>Registered Address:</strong>{" "}
                      {b.registered_address}
                    </div>
                    <div>
                      <strong>Zip Code:</strong> {b.zip_code}
                    </div>
                    <div>
                      <strong>Start Date:</strong>{" "}
                      {new Date(b.started_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        }

        return <span>No businesses available</span>;
      },
      wrap: true,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row: Client) => row.email || "N/A",
      wrap: true,
      width: "7%",
    },
    {
      name: "Contact Number",
      selector: (row: Client) => row.contact_number || "N/A",
      wrap: true,
      width: "10%",
    },
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
      wrap: false,
      width: "5%",
    },
  ];

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Client List</h2>
      <div className="mb-4 flex items-center space-x-4">
        <select
          value={searchColumn}
          onChange={(e) => setSearchColumn(e.target.value)}
          className="w-1/5 p-2 border rounded"
        >
          <option value="firstname">First Name</option>
          <option value="lastname">Last Name</option>
          <option value="middlename">Middle Name</option>
          <option value="birthday">Birthday</option>
          <option value="business_name">Business Name</option>
          <option value="registered_address">Registered Address</option>
          <option value="line_of_business">Line of Business</option>
          <option value="tin">TIN</option>
          <option value="zip_code">Zip Code</option>
          <option value="email">Email</option>
          <option value="contact_number">Contact Number</option>
        </select>

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
        client={selectedClient} // Pass the selected client data
      />
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p>
              Are you sure you want to delete{" "}
              <strong>
                {clientToDelete &&
                  `${clientToDelete.lastname}, ${clientToDelete.firstname}`}
              </strong>
              ?
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
