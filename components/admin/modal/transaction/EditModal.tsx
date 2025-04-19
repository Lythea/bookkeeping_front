// src/components/admin/modal/client/EditClient.tsx

import { useState, useEffect } from "react";

import { AppDispatch } from "@/app/redux/store";
import { updateClientThunk } from "@/app/redux/slice/clientSlice"; // Adjust based on your slice action
import { useDispatch } from "react-redux";

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
interface EditClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
}

const EditClientModal = ({ isOpen, onClose, client }: EditClientModalProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const [editedClient, setEditedClient] = useState<Client | null>(null);

  useEffect(() => {
    if (client) {
      // Check if business is present, otherwise initialize as empty business
      const defaultBusiness =
        client.business.length === 0
          ? [
              {
                business_name: "",
                line_of_business: "",
                registered_address: "",
                started_date: "",
                tin: "",
                zip_code: "",
              },
            ]
          : client.business;

      setEditedClient({
        ...client,
        business: defaultBusiness, // Ensure business is always an array with proper fields
      });
    }
  }, [client]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    if (editedClient) {
      setEditedClient({ ...editedClient, [field]: e.target.value });
    }
  };

  const handleBusinessChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    businessIndex: number,
    field: keyof Business
  ) => {
    if (editedClient) {
      const updatedBusiness = [...editedClient.business];
      updatedBusiness[businessIndex][field] = e.target.value;
      setEditedClient({ ...editedClient, business: updatedBusiness });
    }
  };

  const handleSave = () => {
    if (editedClient) {
      dispatch(updateClientThunk(editedClient)); // Dispatch the action to update client
      onClose(); // Close the modal
    }
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen || !editedClient) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h3 className="text-lg font-semibold mb-4">Edit Client</h3>
        <div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">
              First Name
            </label>
            <input
              type="text"
              value={editedClient.firstname}
              onChange={(e) => handleInputChange(e, "firstname")}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">
              Last Name
            </label>
            <input
              type="text"
              value={editedClient.lastname}
              onChange={(e) => handleInputChange(e, "lastname")}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Birthday</label>
            <input
              type="date"
              value={editedClient.birthday}
              onChange={(e) => handleInputChange(e, "birthday")}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input
              type="email"
              value={editedClient.email || ""}
              onChange={(e) => handleInputChange(e, "email")}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">
              Contact Number
            </label>
            <input
              type="text"
              value={editedClient.contact_number || ""}
              onChange={(e) => handleInputChange(e, "contact_number")}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Business Information */}
          <div className="mb-4">
            <h4 className="font-semibold">Business Information</h4>
            {editedClient.business.map((business, index) => (
              <div key={index} className="mb-4">
                <div className="mb-2">
                  <label className="block text-sm font-semibold mb-1">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={business.business_name}
                    onChange={(e) =>
                      handleBusinessChange(e, index, "business_name")
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-semibold mb-1">
                    Line of Business
                  </label>
                  <input
                    type="text"
                    value={business.line_of_business}
                    onChange={(e) =>
                      handleBusinessChange(e, index, "line_of_business")
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-semibold mb-1">
                    TIN
                  </label>
                  <input
                    type="text"
                    value={business.tin}
                    onChange={(e) => handleBusinessChange(e, index, "tin")}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-semibold mb-1">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    value={business.zip_code}
                    onChange={(e) => handleBusinessChange(e, index, "zip_code")}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-end space-x-4">
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditClientModal;
