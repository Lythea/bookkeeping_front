"use client";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { updateClientThunk } from "@/app/redux/slice/clientSlice";
import { AppDispatch } from "@/app/redux/store";
import { Dialog, Transition } from "@headlessui/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null; // 🟢 Accepts client data to edit
}

interface Client {
  id: number;
  name: string;
  phone: string;
  address: string;
  business_type: string; // ✅ Matches backend
  business_name: string; // ✅ Matches backend
  tin_id: string; // ✅ Matches backend
}

// ✅ Yup Validation Schema (Ensuring field names match backend)
const validationSchema = Yup.object().shape({
  name: Yup.string().required("Client name is required"),
  phone: Yup.string()
    .matches(/^[0-9]+$/, "Phone number must contain only digits")
    .required("Phone is required"),
  address: Yup.string().required("Address is required"),
  business_type: Yup.string().required("Business type is required"),
  business_name: Yup.string().required("Business name is required"),
  tin_id: Yup.string().required("TIN ID is required"),
});

export default function EditClientModal({
  isOpen,
  onClose,
  client,
}: EditModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  if (!client) return null; // Prevents rendering if no client is selected

  const handleSubmit = async (
    values: Client,
    {
      setSubmitting,
      resetForm,
    }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void }
  ) => {
    console.log("🚀 Updating Client:", values);

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
        {/* ✅ Updated Overlay Background */}
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
            {/* ✅ Keep Form Background White */}
            <Dialog.Panel className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                Edit Client
              </Dialog.Title>

              {/* ✅ Formik Form with Pre-Filled Data */}
              <Formik
                initialValues={{
                  id: client.id,
                  name: client.name,
                  phone: client.phone,
                  address: client.address,
                  business_type: client.business_type,
                  business_name: client.business_name,
                  tin_id: client.tin_id,
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className="mt-4 space-y-4">
                    <div>
                      <label className="block text-gray-700">Client Name</label>
                      <Field
                        name="name"
                        className="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300"
                      />
                      <ErrorMessage
                        name="name"
                        component="p"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700">Phone</label>
                      <Field
                        name="phone"
                        className="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300"
                      />
                      <ErrorMessage
                        name="phone"
                        component="p"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700">Address</label>
                      <Field
                        name="address"
                        className="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300"
                      />
                      <ErrorMessage
                        name="address"
                        component="p"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700">
                        Business Type
                      </label>
                      <Field
                        name="business_type"
                        className="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300"
                      />
                      <ErrorMessage
                        name="business_type"
                        component="p"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700">
                        Business Name
                      </label>
                      <Field
                        name="business_name"
                        className="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300"
                      />
                      <ErrorMessage
                        name="business_name"
                        component="p"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700">TIN ID</label>
                      <Field
                        name="tin_id"
                        className="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300"
                      />
                      <ErrorMessage
                        name="tin_id"
                        component="p"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    {/* ✅ Buttons */}
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
                        {isSubmitting ? "Updating..." : "Update Client"}
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
