"use client";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { updateClientThunk } from "@/app/redux/slice/clientSlice";
import { AppDispatch } from "@/app/redux/store";
import { Dialog, Transition } from "@headlessui/react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
}

interface Business {
  business_name: string;
  line_of_business: string;
  registered_address: string;
  started_date: string;
  tin: string;
  zip_code: string;
}

interface Client {
  id?: number;
  firstname: string;
  lastname: string;
  middlename: string | null;
  birthday: string;
  email: string | null;
  contact_number: string | null;
  business: Business[];
}

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

export default function EditClientModal({
  isOpen,
  onClose,
  client,
}: EditModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  if (!client) return null;

  const handleSubmit = async (
    values: Client,
    {
      setSubmitting,
      resetForm,
    }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void }
  ) => {
    try {
      await dispatch(updateClientThunk(values)).unwrap();
      router.refresh();
      resetForm();
      onClose();
    } catch (err) {
      console.error("❌ Failed to update client:", err);
    }
    setSubmitting(false);
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
            <Dialog.Panel className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6 max-h-[80vh] overflow-y-auto">
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                Edit Client
              </Dialog.Title>

              {/* Formik Form */}
              <Formik
                initialValues={{
                  id: client.id || 0,
                  firstname: client.firstname,
                  lastname: client.lastname,
                  middlename: client.middlename || "",
                  birthday: client.birthday,
                  email: client.email || "",
                  contact_number: client.contact_number || "",
                  business: client.business || [], // Properly initialize with businesses if available
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, values }) => (
                  <Form className="mt-4 space-y-4">
                    {/* Name and Date Fields */}
                    <div className="grid grid-cols-3 gap-4">
                      <div>
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
                      <div>
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
                      <div>
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

                    {/* Date of Birth and Email */}
                    <div className="grid grid-cols-3 gap-4 mt-4">
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
                      <div className="col-span-2">
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
                    </div>

                    {/* Contact Number */}
                    <div className="grid grid-cols-3 gap-4 mt-4">
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
                    </div>

                    {/* Business Details */}
                    <FieldArray name="business">
                      {({ push, remove }) => (
                        <>
                          {values.business.map((business, index) => (
                            <div key={index} className="mt-4 space-y-4">
                              <h3 className="font-semibold text-gray-700">
                                Business {index + 1}
                              </h3>
                              <div className="grid grid-cols-3 gap-4">
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
                              </div>

                              {/* Add the TIN field for each business */}
                              <div className="grid grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-gray-700">
                                    TIN
                                  </label>
                                  <Field
                                    name={`business[${index}].tin`}
                                    className="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300"
                                  />
                                  <ErrorMessage
                                    name={`business[${index}].tin`}
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
                              </div>

                              <div className="mt-2">
                                <button
                                  type="button"
                                  onClick={() => remove(index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  Remove Business
                                </button>
                              </div>
                            </div>
                          ))}
                          <div className="mt-4">
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
                              className="text-blue-500 hover:text-blue-700"
                            >
                              Add New Business
                            </button>
                          </div>
                        </>
                      )}
                    </FieldArray>

                    <div className="mt-4 flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 border rounded bg-gray-300 hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 border rounded bg-blue-600 text-white hover:bg-blue-700"
                      >
                        {isSubmitting ? "Submitting..." : "Submit"}
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
