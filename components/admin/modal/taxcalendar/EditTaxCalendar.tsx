"use client";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store";
import { Dialog, Transition } from "@headlessui/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { updateTaxFormThunk } from "@/app/redux/slice/taxcalendarSlice";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  taxForm: {
    id: number;
    form_no: string;
    due_date: string;
    frequency: string;
  } | null;
  services?: any;
}

const validationSchema = Yup.object().shape({
  form_no: Yup.string().required("Form number is required"),
  frequency: Yup.string().required("Frequency is required"),
  due_date: Yup.string().required("Due date is required"),
});

export default function EditTaxCalendar({
  isOpen,
  onClose,
  taxForm,
  services,
}: EditModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleSubmit = async (
    values: any,
    {
      setSubmitting,
    }: {
      setSubmitting: (isSubmitting: boolean) => void;
    }
  ) => {
    try {
      await dispatch(
        updateTaxFormThunk({ id: taxForm?.id, ...values })
      ).unwrap();
      router.refresh();
      onClose();
    } catch (error) {
      console.error("❌ Failed to edit tax form:", error);
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
            <Dialog.Panel className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                Edit Tax Form
              </Dialog.Title>

              <Formik
                initialValues={{
                  form_no: taxForm?.form_no || "",
                  due_date: taxForm?.due_date || "",
                  frequency: taxForm?.frequency || "",
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({ isSubmitting }) => (
                  <Form className="mt-4 space-y-4">
                    {/* Form Number Dropdown */}
                    <div>
                      <label className="block text-gray-700">Form Number</label>
                      <Field
                        as="select"
                        name="form_no"
                        className="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300"
                      >
                        <option value="">Select a Form</option>
                        {services?.map((service: any) =>
                          service.forms.map((form: any) => (
                            <option key={form.name} value={form.name}>
                              {form.name}
                            </option>
                          ))
                        )}
                      </Field>
                      <ErrorMessage
                        name="form_no"
                        component="p"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    {/* Frequency Dropdown */}
                    <div>
                      <label className="block text-gray-700">Frequency</label>
                      <Field
                        as="select"
                        name="frequency"
                        className="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300"
                      >
                        <option value="">Select Frequency</option>
                        <option value="annual">Annual</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="monthly">Monthly</option>
                        <option value="manual">Manual</option>
                      </Field>
                      <ErrorMessage
                        name="frequency"
                        component="p"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    {/* Due Date */}
                    <div>
                      <label className="block text-gray-700">Due Date</label>
                      <Field
                        type="date"
                        name="due_date"
                        className="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300"
                      />
                      <ErrorMessage
                        name="due_date"
                        component="p"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                      <button
                        type="button"
                        className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                        onClick={onClose}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Save Changes
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
