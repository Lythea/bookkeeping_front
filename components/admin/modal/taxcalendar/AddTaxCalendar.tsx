"use client";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store";
import { Dialog, Transition } from "@headlessui/react";
import { Formik, Form, Field, ErrorMessage, FieldProps } from "formik";
import * as Yup from "yup";
import {
  addTaxFormThunk,
  updateTaxFormThunk,
  deleteTaxFormThunk,
} from "@/app/redux/slice/taxcalendarSlice";
import DatePicker from "react-datepicker"; // Importing the date picker component
import "react-datepicker/dist/react-datepicker.css"; // Import the styles for the calendar

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TaxForm {
  id: number;
  form_no: string;
  latest_revision_date: string;
  form_name: string;
  due_date: string;
}

// Yup Validation Schema (Updated for tax form fields)
const validationSchema = Yup.object().shape({
  form_no: Yup.string().required("Form number is required"),
  latest_revision_date: Yup.string().required(
    "Latest revision date is required"
  ),
  form_name: Yup.string().required("Form name is required"),
  due_date: Yup.string().required("Due date is required"),
});

export default function AddModal({ isOpen, onClose }: AddModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleSubmit = async (
    values: TaxForm,
    {
      setSubmitting,
      resetForm,
    }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void }
  ) => {

    try {
      await dispatch(addTaxFormThunk(values)).unwrap();
      router.refresh();
      resetForm(); // Clear form after submission
      onClose(); // Close modal
    } catch (err) {
      console.error("❌ Failed to add tax form:", err);
    }
    setSubmitting(false);
  };

  return (
    <Transition appear show={isOpen} as="div">
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Updated Overlay Background */}
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
            {/* Keep Form Background White */}
            <Dialog.Panel className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                Add New Tax Form
              </Dialog.Title>

              {/* Formik Form */}
              <Formik
                initialValues={{
                  id: 0,
                  form_no: "",
                  latest_revision_date: "",
                  form_name: "",
                  due_date: "",
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, setFieldValue, values }) => (
                  <Form className="mt-4 space-y-4">
                    <div>
                      <label className="block text-gray-700">Form Number</label>
                      <Field
                        name="form_no"
                        className="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300"
                      />
                      <ErrorMessage
                        name="form_no"
                        component="p"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700">
                        Latest Revision Date
                      </label>
                      <Field
                        name="latest_revision_date"
                        className="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300"
                      />
                      <ErrorMessage
                        name="latest_revision_date"
                        component="p"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700">Form Name</label>
                      <Field
                        name="form_name"
                        className="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300"
                      />
                      <ErrorMessage
                        name="form_name"
                        component="p"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700">Due Date</label>
                      {/* DatePicker for Due Date */}
                      <DatePicker
                        selected={
                          values.due_date ? new Date(values.due_date) : null
                        }
                        onChange={(date: Date | null) =>
                          setFieldValue(
                            "due_date",
                            date ? date.toISOString().split("T")[0] : ""
                          )
                        }
                        dateFormat="yyyy-MM-dd"
                        className="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300"
                      />
                      <ErrorMessage
                        name="due_date"
                        component="p"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    {/* Buttons */}
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
                        {isSubmitting ? "Adding..." : "Add Tax Form"}
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
