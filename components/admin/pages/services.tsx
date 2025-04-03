"use client";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store";
import React, { useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { FaEdit, FaTrash } from "react-icons/fa";
import { jsPDF } from "jspdf";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import AddModal from "@/components/admin/modal/services/AddServices";
import EditServices from "@/components/admin/modal/services/EditServices";
import {
  deleteFormThunk,
  deleteServiceWithFormsThunk,
  updateServiceNameThunk,
} from "@/app/redux/slice/serviceSlice";

interface Form {
  name: string;
  file: File | null;
  price: string;
  description: string;
}

interface ServiceFormData {
  forms: Form[];
}

interface Service {
  id: number;
  service: string;
  forms: Form[];
}

interface ServiceLayoutProps {
  services: Service[]; // Expecting `services` prop to be passed
}

const ServiceLayout: React.FC<ServiceLayoutProps> = ({ services }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter(); // To trigger page refresh when necessary

  const [expandedRows, setExpandedRows] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [serviceIdToDelete, setServiceIdToDelete] = useState<number | null>(
    null
  );
  const [formIndexToDelete, setFormIndexToDelete] = useState<number | null>(
    null
  );
  const [isDeleteServicePopupOpen, setIsDeleteServicePopupOpen] =
    useState(false);
  const [isEditServicePopupOpen, setIsEditServicePopupOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState<ServiceFormData | null>(
    null
  );
  const [serviceToDelete, setServiceToDelete] = useState<{
    serviceId: number;
    serviceName: string;
  } | null>(null);
  const [mainServicetoEdit, setMainServicetoEdit] = useState<{
    serviceId: number;
    serviceName: string;
  }>({
    serviceId: 0,
    serviceName: "",
  });
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);

  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const handleDeleteService = (serviceId: number, serviceName: string) => {
    setServiceToDelete({ serviceId, serviceName });
    setIsDeleteServicePopupOpen(true); // Open the confirmation popup
  };

  const handleEditService = (serviceId: number, serviceName: string) => {
    console.log(
      `Edit service with id: ${serviceId} and service name: ${serviceName}`
    );
    setMainServicetoEdit({ serviceId, serviceName });
    setIsEditServicePopupOpen(true);
  };

  const openDeletePopup = (serviceId: number, serviceName: string) => {
    setMainServicetoEdit({ serviceId, serviceName });
    setIsDeleteServicePopupOpen(true); // Show delete confirmation popup
  };

  const openEditModal = (
    form: ServiceFormData,
    service_id: number,
    service_name: string
  ) => {
    const formDataWithService = { ...form, service_id, service_name }; // Add serviceId and serviceName to form data
    console.log(formDataWithService);
    setServiceToEdit(formDataWithService); // Set the form with service info to be edited
    setIsEditModalOpen(true); // Open the edit modal
  };
  const handleDeleteForm = (serviceId: number, formIndex: number) => {
    setServiceIdToDelete(serviceId);
    setFormIndexToDelete(formIndex);
    setIsDeleteModalOpen(true); // Open modal
  };

  const confirmDeleteForm = async () => {
    if (serviceIdToDelete === null || formIndexToDelete === null) return;

    try {
      // Dispatch the deleteFormThunk action to delete the form
      await dispatch(
        deleteFormThunk({
          serviceId: serviceIdToDelete,
          formIndex: formIndexToDelete,
        })
      );
      router.refresh();
      // Close the modal after deletion
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting form:", error);
      alert("Error deleting form. Please try again.");
    }
  };

  const cancelDeleteForm = () => {
    setIsDeleteModalOpen(false); // Close modal without deleting
  };
  const closeEditModal = () => {
    setIsEditModalOpen(false); // Close the edit modal
    setServiceToEdit(null); // Clear the form data
  };
  // Toggle expansion for a service row
  const toggleExpand = (id: number) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Toggle action menu (Ensures only one menu opens at a time)
  const toggleMenu = (key: string) => {
    setMenuOpen((prev) => (prev === key ? null : key));
  };

  // Filtered data based on search query
  const filteredData = services
    .map((service) => ({
      ...service,
      forms: service.forms.filter((form) =>
        form.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter(
      (service) =>
        service.forms.length > 0 ||
        service.service.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Paginate the data
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle previous and next page
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = async (serviceId: number, serviceName: string) => {
    await dispatch(deleteServiceWithFormsThunk(serviceId));
    router.refresh();
  };
  const handleUpdateService = async () => {
    if (mainServicetoEdit) {
      // Dispatch the updateServiceNameThunk action
      await dispatch(
        updateServiceNameThunk({
          serviceId: mainServicetoEdit.serviceId,
          serviceName: mainServicetoEdit.serviceName,
        })
      );
    }
    router.refresh();
    setIsEditServicePopupOpen(false); // Close the popup after saving
  };

  const exportToPDF = () => {};

  // Export to Excel
  const exportToExcel = () => {};

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Service List</h2>
      {/* Search Input */}
      <div className="mb-4 flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search services or forms..."
          className="w-1/3 p-2 border rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Action Buttons aligned to the right */}
        <div className="flex ml-auto space-x-4">
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Service
          </button>

          <button
            onClick={exportToPDF}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Export PDF
          </button>

          <button
            onClick={exportToExcel}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Export Excel
          </button>
        </div>
      </div>
      <table className="w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left w-1/2">Service / Forms</th>
            <th className="p-3 text-left w-1/4">Price</th>
            <th className="p-3 text-left w-1/4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((service) => (
            <React.Fragment key={service.id}>
              {/* Service Row */}

              <tr
                onClick={() => toggleExpand(service.id)}
                className="cursor-pointer bg-gray-50 hover:bg-gray-200 transition"
              >
                <td className="p-3 font-semibold">{service.service}</td>
                <td className="p-3 text-gray-400 italic flex items-center space-x-2">
                  <span>Click to expand</span>

                  {/* Edit Icon */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row expansion when clicking on edit
                      handleEditService(service.id, service.service); // Call handleEditService with service details
                    }}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaEdit /> {/* React Icon for Edit */}
                  </button>

                  {/* Delete Icon */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row expansion when clicking on delete
                      handleDeleteService(service.id, service.service); // Passing service.id and service.service
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash /> {/* React Icon for Trash */}
                  </button>
                </td>
                <td className="p-3"></td>
              </tr>

              {/* Expanded Forms Rows */}
              {expandedRows[service.id] &&
                service.forms.map((form, index) => (
                  <tr key={index} className="bg-white">
                    <td className="p-3 pl-6 text-gray-600">
                      →{" "}
                      <a
                        href={
                          form.file
                            ? form.file instanceof File
                              ? URL.createObjectURL(form.file) // Blob URL for the file
                              : `${process.env.NEXT_PUBLIC_API_URL}/${form.file}` // Use the correct API URL for services
                            : "#"
                        }
                        target="_blank" // Ensure the file opens in a new tab
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline text-md ml-2"
                        onClick={() => {
                          console.log(
                            "File URL:",
                            `${process.env.NEXT_PUBLIC_API_URL}/${form.file}`
                          ); // Log the full URL when clicked
                        }}
                      >
                        {form.name}
                      </a>
                      <p className="text-gray-500 text-sm mt-1">
                        {form.description}
                      </p>
                    </td>
                    <td className="p-3">{form.price}</td>
                    <td className="p-3 relative">
                      <button
                        onClick={() => toggleMenu(`${service.id}-${index}`)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <HiDotsVertical size={20} />
                      </button>
                      {menuOpen === `${service.id}-${index}` && (
                        <div className="absolute top-full left-0 min-w-[120px] bg-white shadow-md rounded-md -mt-5 z-50">
                          <button
                            className="block w-full text-left px-3 py-2 hover:bg-gray-200"
                            onClick={() =>
                              openEditModal(
                                { forms: [form] }, // pass form wrapped in an object
                                service.id, // pass serviceId
                                service.service // pass serviceName
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="block w-full text-left px-3 py-2 hover:bg-gray-200 text-red-500"
                            onClick={() => handleDeleteForm(service.id, index)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {Math.ceil(filteredData.length / itemsPerPage)}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={
            currentPage === Math.ceil(filteredData.length / itemsPerPage)
          }
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
      <AddModal isOpen={isAddModalOpen} onClose={closeAddModal} />
      <EditServices
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        serviceToEdit={serviceToEdit}
      />{" "}
      {isDeleteServicePopupOpen && serviceToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p>
              Are you sure you want to delete{" "}
              <strong>{serviceToDelete.serviceName}</strong>?
            </p>
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={() => setIsDeleteServicePopupOpen(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDelete(
                    serviceToDelete.serviceId,
                    serviceToDelete.serviceName
                  );
                  setIsDeleteServicePopupOpen(false); // Close the popup after deletion
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {isEditServicePopupOpen && mainServicetoEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-lg font-semibold mb-4">Edit Service</h3>
            <input
              type="text"
              value={mainServicetoEdit.serviceName} // Make it controlled input
              onChange={(e) => {
                setMainServicetoEdit((prev) => ({
                  ...prev!,
                  serviceName: e.target.value,
                }));
              }}
              className="w-full p-2 border rounded mb-4"
            />
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={() => setIsEditServicePopupOpen(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateService} // Call the separate function
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p>Are you sure you want to delete this form?</p>
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={cancelDeleteForm}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteForm}
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

export default ServiceLayout;
