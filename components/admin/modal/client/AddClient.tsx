"use client";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store";
import { Dialog, Transition } from "@headlessui/react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { addClientThunk } from "@/app/redux/slice/clientSlice";

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BusinessFormData {
  business_name: string;
  line_of_business: string;
  registered_address: string;
  started_date: string;
  tin: string;
  zip_code: string;
}

interface ClientFormData {
  id?: number; // Make the id optional
  firstname: string;
  lastname: string;
  middlename: string | null;
  birthday: string;
  email: string | null;
  contact_number: string | null;
  business: BusinessFormData[]; // Updated to match the Business array structure
}

// ✅ Yup Validation Schema (Updated with email and contact number validation)
const validationSchema = Yup.object().shape({
  lastname: Yup.string().required("Last name is required"),
  firstname: Yup.string().required("First name is required"),
  middlename: Yup.string().required("Middle name is required"),
  birthday: Yup.string().required("Birthday is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  contact_number: Yup.string()
    .matches(/^[0-9]{10,12}$/, "Contact number must be between 10 to 12 digits")
    .required("Contact number is required"),

  business: Yup.array().of(
    Yup.object().shape({
      business_name: Yup.string().required("Business name is required"),
      line_of_business: Yup.string().required("Line of business is required"),
      registered_address: Yup.string().required("Address is required"),
      started_date: Yup.string().required("Started date is required"),
      tin: Yup.string().required("TIN is required"),
      zip_code: Yup.string().required("Zip code is required"),
    })
  ),
});

export default function AddModal({ isOpen, onClose }: AddModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const handleSubmit = async (
    values: ClientFormData,
    {
      setSubmitting,
      resetForm,
    }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void }
  ) => {
    console.log(values);
    try {
      const formData = {
        ...values,
        id: values.id || Date.now(), // Provide a default ID if it's missing (e.g., using Date.now() for a unique ID)
      };

      await dispatch(addClientThunk(formData)).unwrap();
      router.refresh();
      resetForm(); // Clear form after submission
      onClose(); // Close modal
    } catch (err) {
      console.error("❌ Failed to add client:", err);
    }
    setSubmitting(false);
  };

  const handleTINChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: any
  ) => {
    let inputValue = e.target.value;

    // Real-time formatting function
    inputValue = inputValue
      .replace(/\D/g, "") // Remove any non-digit characters
      .replace(/(\d{3})(\d{3})(\d{3})(\d{3})/, "$1-$2-$3-$4") // Format to 000-000-000-000
      .substring(0, 15); // Ensure max length is 15 characters (for the TIN format)

    // Update the field value dynamically
    setFieldValue("tin", inputValue);
  };

  return (
    <Transition appear show={isOpen} as="div">
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            enter="transition-all duration-300 ease-out"
            enterFrom="opacity-0 scale-90"
            enterTo="opacity-100 scale-100"
            leave="transition-all duration-200 ease-in"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-90"
          >
            <Dialog.Panel className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6">
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                Add New Client
              </Dialog.Title>

              {/* Formik Form */}
              <Formik
                initialValues={{
                  firstname: "",
                  lastname: "",
                  middlename: "",
                  birthday: "",
                  email: "",
                  contact_number: "",
                  business: [
                    {
                      business_name: "",
                      line_of_business: "",
                      registered_address: "",
                      started_date: "",
                      tin: "",
                      zip_code: "",
                    },
                  ],
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, setFieldValue, values }) => (
                  <Form className="mt-4 space-y-4">
                    {/* Personal Information Fields */}
                    <div className="flex gap-4">
                      <div className="w-1/3">
                        <label className="block text-gray-700">Last Name</label>
                        <Field
                          name="lastname"
                          className="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300"
                        />
                        <ErrorMessage
                          name="lastname"
                          component="p"
                          className="text-red-500 text-sm"
                        />
                      </div>

                      <div className="w-1/3">
                        <label className="block text-gray-700">
                          First Name
                        </label>
                        <Field
                          name="firstname"
                          className="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300"
                        />
                        <ErrorMessage
                          name="firstname"
                          component="p"
                          className="text-red-500 text-sm"
                        />
                      </div>

                      <div className="w-1/3">
                        <label className="block text-gray-700">
                          Middle Name
                        </label>
                        <Field
                          name="middlename"
                          className="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300"
                        />
                        <ErrorMessage
                          name="middlename"
                          component="p"
                          className="text-red-500 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700">Birthday</label>
                      <Field
                        name="birthday"
                        type="date"
                        className="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300"
                      />
                      <ErrorMessage
                        name="birthday"
                        component="p"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700">Email</label>
                      <Field
                        name="email"
                        type="email"
                        className="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300"
                      />
                      <ErrorMessage
                        name="email"
                        component="p"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700">
                        Contact Number
                      </label>
                      <Field
                        name="contact_number"
                        className="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300"
                      />
                      <ErrorMessage
                        name="contact_number"
                        component="p"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    {/* Business Details */}
                    <FieldArray name="business">
                      {({ push, remove }) => (
                        <>
                          {values.business.map((_, index) => (
                            <div
                              key={index}
                              className="grid grid-cols-3 gap-4 mt-4"
                            >
                              <div>
                                <label className="block text-gray-700">
                                  Business Name
                                </label>
                                <Field
                                  name={`business[${index}].business_name`}
                                  className="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300"
                                />
                                <ErrorMessage
                                  name={`business[${index}].business_name`}
                                  component="p"
                                  className="text-red-500 text-sm"
                                />
                              </div>

                              <div>
                                <label className="block text-gray-700">
                                  Line of Business
                                </label>
                                <Field
                                  name={`business[${index}].line_of_business`}
                                  className="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300"
                                />
                                <ErrorMessage
                                  name={`business[${index}].line_of_business`}
                                  component="p"
                                  className="text-red-500 text-sm"
                                />
                              </div>

                              <div>
                                <label className="block text-gray-700">
                                  Registered Address
                                </label>
                                <Field
                                  name={`business[${index}].registered_address`}
                                  className="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300"
                                />
                                <ErrorMessage
                                  name={`business[${index}].registered_address`}
                                  component="p"
                                  className="text-red-500 text-sm"
                                />
                              </div>

                              <div>
                                <label className="block text-gray-700">
                                  Started Date
                                </label>
                                <Field
                                  name={`business[${index}].started_date`}
                                  type="date"
                                  className="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300"
                                />
                                <ErrorMessage
                                  name={`business[${index}].started_date`}
                                  component="p"
                                  className="text-red-500 text-sm"
                                />
                              </div>

                              <div>
                                <label className="block text-gray-700">
                                  TIN
                                </label>
                                <Field name={`business[${index}].tin`}>
                                  {({ field, form }) => {
                                    const formatTIN = (value) => {
                                      // Remove non-alphanumerics and limit to 12 characters
                                      const cleaned = value
                                        .replace(/[^a-zA-Z0-9]/g, "")
                                        .slice(0, 12);
                                      return (
                                        cleaned.match(/.{1,3}/g)?.join("-") ||
                                        ""
                                      );
                                    };

                                    const handleChange = (e) => {
                                      const cleaned = e.target.value
                                        .replace(/[^a-zA-Z0-9]/g, "")
                                        .slice(0, 12);
                                      const formatted = formatTIN(cleaned);
                                      form.setFieldValue(
                                        `business[${index}].tin`,
                                        formatted
                                      );
                                    };

                                    const handleBlur = () => {
                                      let cleaned = field.value.replace(
                                        /[^a-zA-Z0-9]/g,
                                        ""
                                      );
                                      if (cleaned.length < 12) {
                                        cleaned =
                                          cleaned +
                                          "0".repeat(12 - cleaned.length);
                                      }
                                      const formatted = formatTIN(cleaned);
                                      form.setFieldValue(
                                        `business[${index}].tin`,
                                        formatted
                                      );
                                    };

                                    return (
                                      <input
                                        {...field}
                                        className="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={field.value}
                                      />
                                    );
                                  }}
                                </Field>
                                <ErrorMessage
                                  name={`business[${index}].tin`}
                                  component="p"
                                  className="text-red-500 text-sm"
                                />
                              </div>

                              <div>
                                <label className="block text-gray-700">
                                  Zip Code
                                </label>
                                <Field
                                  name={`business[${index}].zip_code`}
                                  className="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300"
                                />
                                <ErrorMessage
                                  name={`business[${index}].zip_code`}
                                  component="p"
                                  className="text-red-500 text-sm"
                                />
                              </div>

                              {/* Remove Button for Business */}
                              <div className="flex justify-center items-center">
                                <button
                                  type="button"
                                  onClick={() => remove(index)}
                                  className="px-4 py-2 text-red-500 hover:text-red-700"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ))}

                          {/* Add New Business Button */}
                          <button
                            type="button"
                            onClick={() =>
                              push({
                                business_name: "",
                                line_of_business: "",
                                registered_address: "",
                                started_date: "",
                                tin: "",
                                zip_code: "",
                              })
                            }
                            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                          >
                            Add Another Business
                          </button>
                        </>
                      )}
                    </FieldArray>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-2 mt-4">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Adding..." : "Add Client"}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
