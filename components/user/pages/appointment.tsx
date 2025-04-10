"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/app/redux/store";

import {
  addTransactionThunk,
  deleteTransactionThunk,
} from "@/app/redux/services/transactionService"; // <-- UPDATE THIS TO YOUR CORRECT PATH
type AppointmentProps = {
  data: any[]; // Accept the data prop as an array
};

interface FormData {
  service: string;
  name: string;
  address: string;
  email: string;
  contact: string;
  date: string;
  status: string;
  inquiries: any[];
  transact: string; // Ensure transact is defined in the form data as well
}
export default function Appointment({ data }: AppointmentProps) {
  console.log(data);
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState<FormData>({
    service: "",
    name: "",
    address: "",
    email: "",
    contact: "",
    date: "",
    status: "Pending",
    transact: "Pending", // Adding the transact field
    inquiries: [] as any[], // Ensure it starts as an empty array of any[]
  });

  const [visibleForm, setVisibleForm] = useState<number | null>(null);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalFee, setTotalFee] = useState<number>(0);

  useEffect(() => {
    const newTotal = inquiries.reduce(
      (sum, item) => sum + Number(item.form.price || 0),
      0
    );
    setTotalFee(newTotal);
  }, [inquiries]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value, // This dynamically updates the field based on its name
    }));
  };

  const handleServiceClick = (serviceId: number) => {
    setVisibleForm(visibleForm === serviceId ? null : serviceId);
  };

  const handleInquire = (item: any, form: any) => {
    const newInquiry = { ...item, form };
    setInquiries([...inquiries, newInquiry]);
    setFormData((prev) => ({
      ...prev,
      service: item.service,
      inquiries: [...prev.inquiries, newInquiry], // Add inquiry to formData
    }));
  };

  const handleRemoveInquiry = (index: number) => {
    const newInquiries = inquiries.filter((_, i) => i !== index);
    setInquiries(newInquiries);
    setFormData((prev) => ({
      ...prev,
      inquiries: newInquiries, // Update formData inquiries
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create a new object with only the required properties
    const formattedData = {
      id: 0,
      ...formData,
      inquiries: formData.inquiries.map(({ form, service }) => ({
        service: service,
        name: form.name,
        price: form.price,
      })),
    };

    // Dispatch the addTransactionThunk action
    try {
      await dispatch(addTransactionThunk(formattedData)); // Dispatch to Redux store
    } catch (error) {
      console.error("Error submitting the appointment:", error);
    }
  };

  const filteredData = data.filter(
    (item) =>
      item.service &&
      item.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col bg-gray-50 w-full min-h-screen">
      <main className="flex-grow flex items-center justify-center p-6 sm:p-8">
        <div className="container w-full bg-white shadow-2xl rounded-3xl p-6 sm:p-12 h-full flex items-center transition-transform hover:scale-[1.01] duration-300 ease-in-out">
          <section className="w-full flex flex-col items-center justify-between gap-8 md:gap-12">
            <div className="w-full">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-700 leading-tight text-center">
                Book an Appointment
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mt-3 sm:mt-4 text-center">
                Select a service and fill in your details to schedule an
                appointment.
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-6 w-full max-w-lg sm:max-w-none"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Available Services */}
                  <div className="bg-white p-5 shadow-md rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-gray-700">
                        Available Services
                      </h2>
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search..."
                        className="w-1/2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="max-h-96 overflow-y-auto rounded-lg p-3">
                      {filteredData.map((item) => (
                        <div key={item.id} className="border-b py-3">
                          <p
                            className="font-medium text-lg text-gray-800 cursor-pointer hover:text-blue-600 transition duration-200"
                            onClick={() => handleServiceClick(item.id)}
                          >
                            {item.service}
                          </p>

                          {visibleForm === item.id && (
                            <div className="mt-3 space-y-2">
                              {item.forms.map((form: any, index: any) => (
                                <div
                                  key={index}
                                  className="p-3 bg-gray-100 rounded-lg"
                                >
                                  <p className="text-sm text-gray-600">
                                    {form.name} - {form.description}
                                  </p>
                                  <p className="text-sm font-semibold text-gray-700">
                                    Price: ${Number(form.price).toFixed(2)}
                                  </p>
                                  <button
                                    type="button"
                                    className="mt-2 text-blue-600 hover:underline"
                                    onClick={() => handleInquire(item, form)}
                                  >
                                    Inquire
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Inquiries */}
                  <div className="bg-white p-5 shadow-md rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-700">
                      Inquiries
                    </h2>
                    <div className="max-h-96 overflow-y-auto p-3">
                      {inquiries.map((inquiry, index) => (
                        <div key={index} className="border-b py-3">
                          <p className="font-medium text-lg text-gray-800">
                            {inquiry.service} - {inquiry.form.name}
                          </p>
                          <p className="text-sm font-semibold text-gray-700">
                            Price: ${Number(inquiry.form.price).toFixed(2)}
                          </p>
                          <button
                            type="button"
                            className="mt-2 text-red-600 hover:underline"
                            onClick={() => handleRemoveInquiry(index)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                    <p className="font-semibold text-lg text-gray-800 mt-3">
                      Total Fee: ${totalFee.toFixed(2)}
                    </p>
                  </div>

                  {/* User Details */}
                  <div className="bg-white p-5 shadow-md rounded-lg space-y-4">
                    {[
                      {
                        label: "Full Name",
                        name: "name",
                        type: "text",
                        placeholder: "Enter your name",
                      },
                      {
                        label: "Address",
                        name: "address",
                        type: "text",
                        placeholder: "Enter your address",
                      },
                      {
                        label: "Email",
                        name: "email",
                        type: "email",
                        placeholder: "Enter your email",
                      },
                      {
                        label: "Contact Number",
                        name: "contact",
                        type: "text",
                        placeholder: "Enter your contact number",
                      },
                      {
                        label: "Date of Deadline",
                        name: "date",
                        type: "date",
                        placeholder: "",
                      },
                    ].map((field) => (
                      <div key={field.name}>
                        <label className="block text-base sm:text-lg font-semibold text-gray-700">
                          {field.label}
                        </label>
                        <input
                          type={field.type}
                          name={field.name}
                          value={formData[field.name as keyof FormData]}
                          onChange={handleChange}
                          placeholder={field.placeholder}
                          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="text-center mt-6">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white text-lg font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 w-full sm:w-auto"
                  >
                    Submit Appointment
                  </button>
                </div>
              </form>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
