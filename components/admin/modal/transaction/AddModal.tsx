import { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/app/redux/store"; // Import your store types

import { addTransactionThunk } from "@/app/redux/services/transactionService"; // Import the action

interface Inquiry {
  name: string;
  price: string;
  service: string;
  filePath: string; // Added to match the actual usage
}

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

type Business = {
  business_name: string;
  tin: string;
  line_of_business: string;
  registered_address: string;
  started_date: string;
  zip_code: string;
};

type Client = {
  id: number;
  firstname: string;
  middlename: string;
  lastname: string;
  birthday: string;
  contact_number: string;
  email: string;
  created_at: string;
  updated_at: string;
  business: Business[]; // ✅ THIS IS IMPORTANT
};

interface ServiceForm {
  file: string;
  name: string;
  price: string;
}

interface Service {
  id: number;
  service: string;
  forms: ServiceForm[];
}

interface AddModalProps {
  onClose: () => void;
  clients: Client[];
  services: Service[];
  onSuccess?: () => void; // <--- Add this
}

const AddModal: React.FC<AddModalProps> = ({
  onClose,
  clients,
  services,
  onSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  console.log(clients);

  const [formData, setFormData] = useState<Transaction>({
    id: 0,
    name: "",
    date: "",
    status: "Pending",
    business_name: "",
    tin_id: "",
    inquiries: [],
  });
  console.log(services);
  const [openServiceIds, setOpenServiceIds] = useState<number[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedBusiness, setSelectedBusiness] = useState<{
    business_name: string;
    tin: string;
  } | null>(null);

  const toggleServiceDropdown = (serviceId: number) => {
    setOpenServiceIds((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const client = clients.find((c) => c.id === parseInt(e.target.value));
    if (client) {
      setSelectedClient(client); // Set full client object
      setFormData((prev) => ({
        ...prev,
        name: `${client.firstname} ${client.middlename} ${client.lastname}`,
      }));
      setSelectedBusiness(null); // reset business selection
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, date: e.target.value });
  };
  const handleCheckboxChange = (
    form: ServiceForm,
    serviceName: string,
    filePath: string
  ) => {
    const exists = formData.inquiries.some(
      (inq) => inq.name === form.name && inq.service === serviceName
    );

    if (exists) {
      setFormData((prev) => ({
        ...prev,
        inquiries: prev.inquiries.filter(
          (inq) => !(inq.name === form.name && inq.service === serviceName)
        ),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        inquiries: [
          ...prev.inquiries,
          {
            name: form.name,
            price: form.price,
            service: serviceName,
            filePath: filePath, // Add the file path here
          },
        ],
      }));
    }
  };

  const computeTotal = useMemo(() => {
    return formData.inquiries.reduce(
      (sum, inquiry) => sum + parseFloat(inquiry.price || "0"),
      0
    );
  }, [formData.inquiries]);

  const handleSubmit = async () => {
    console.log("📝 New Transaction Data:", formData);

    try {
      const result = await dispatch(addTransactionThunk(formData)).unwrap();

      console.log("✅ Server response:", result);

      // Validate that result.downloads is an array and has valid URLs
      const validDownloads = Array.isArray(result?.downloads)
        ? result.downloads.filter(
            (url) => typeof url === "string" && url.trim() !== ""
          )
        : [];
      console.log(validDownloads);
      if (validDownloads.length > 0) {
        validDownloads.forEach((url) => {
          const link = document.createElement("a");
          link.href = url;
          link.download = ""; // Let browser handle filename
          link.target = "_blank"; // Optional: open in new tab if needed
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
      } else {
        console.warn(
          "⚠️ No valid downloads returned. Skipping download process."
        );
      }

      if (onSuccess) onSuccess(); // Optional success callback

      onClose(); // Close modal
    } catch (error) {
      console.error("❌ Transaction failed:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white p-6 rounded-lg w-[500px] shadow-lg max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">Add Transaction</h3>

        <div className="space-y-3">
          <label className="block text-sm font-medium">Client's Name</label>
          <select
            className="w-full p-2 border rounded"
            onChange={handleClientChange}
            defaultValue=""
          >
            <option value="" disabled>
              Select Client
            </option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {`${client.firstname} ${client.middlename} ${client.lastname}`}
              </option>
            ))}
          </select>
          {selectedClient && selectedClient.business && (
            <>
              <label className="block text-sm font-medium mt-3">
                Business Name
              </label>
              <select
                className="w-full p-2 border rounded"
                onChange={(e) => {
                  const biz = selectedClient.business.find(
                    (b) => b.business_name === e.target.value
                  );
                  if (biz) {
                    setSelectedBusiness({
                      business_name: biz.business_name,
                      tin: biz.tin,
                    });
                    setFormData((prev) => ({
                      ...prev,
                      business_name: biz.business_name,
                      tin_id: biz.tin,
                    }));
                  }
                }}
                defaultValue=""
              >
                <option value="" disabled>
                  Select Business
                </option>
                {selectedClient.business.map((b, index) => (
                  <option key={index} value={b.business_name}>
                    {b.business_name}
                  </option>
                ))}
              </select>

              {selectedBusiness && (
                <>
                  <label className="block text-sm font-medium mt-3">TIN</label>
                  <input
                    type="text"
                    value={selectedBusiness.tin}
                    readOnly
                    className="w-full p-2 border rounded bg-gray-100"
                  />
                </>
              )}
            </>
          )}

          <label className="block text-sm font-medium">Deadline Date</label>
          <input
            type="date"
            name="date"
            className="w-full p-2 border rounded"
            value={formData.date}
            onChange={handleDateChange}
          />

          {/* Services with dropdown and checkboxes */}
          <div className="mt-4">
            <h4 className="text-lg font-semibold mb-2">Select Services</h4>
            <div className="space-y-2">
              {services.map((service) => {
                const isOpen = openServiceIds.includes(service.id);
                return (
                  <div
                    key={service.id}
                    className="p-2 border-b border-gray-300"
                  >
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => toggleServiceDropdown(service.id)}
                    >
                      <span className="font-medium">{service.service}</span>
                      <span>{isOpen ? "▲" : "▼"}</span>
                    </div>

                    {isOpen && (
                      <div className="mt-2 space-y-3 pl-3">
                        {service.forms.map((form) => {
                          const isChecked = formData.inquiries.some(
                            (inq) =>
                              inq.name === form.name &&
                              inq.service === service.service
                          );

                          return (
                            <div
                              key={form.name}
                              className="flex items-center justify-between"
                            >
                              <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={
                                    () =>
                                      handleCheckboxChange(
                                        form,
                                        service.service,
                                        form.file
                                      ) // Pass the file path here
                                  }
                                />
                                <span>{form.name}</span>
                              </label>
                              <span className="text-sm text-gray-700 font-semibold">
                                ₱{form.price}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-4 text-right text-lg font-bold text-green-600">
          Total: ₱{computeTotal.toFixed(2)}
        </div>

        <div className="mt-5 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddModal;
