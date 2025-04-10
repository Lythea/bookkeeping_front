"use client";
import { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store";
import { updateServiceThunk } from "@/app/redux/slice/serviceSlice"; // Example redux action for updating service
import { useRouter } from "next/navigation";
interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceToEdit: ServiceFormData | null; // Define the type for serviceToEdit
}

interface ServiceFormData {
  [x: string]: any;
  forms: Array<{
    name: string;
    file: File | null;
    price: string;
    description: string;
  }>;
}

const validationSchema = Yup.object().shape({
  forms: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("Form name is required"),
      file: Yup.mixed()
        .nullable()
        .required("File is required")
        .test("fileType", "Must be a valid file", (value) => {
          return value instanceof File || value === null;
        }),
      price: Yup.string().required("Price is required"),
      description: Yup.string().required("Description is required"),
    })
  ),
});

export default function EditServiceModal({
  isOpen,
  onClose,
  serviceToEdit,
}: EditModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleSubmit = async (
    values: ServiceFormData,
    {
      setSubmitting,
      resetForm,
    }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void }
  ) => {
    try {
      const formData = new FormData();

      // Append serviceId and serviceName to formData
      formData.append("service_id", serviceToEdit?.service_id);
      formData.append("service_name", serviceToEdit?.service_name);

      // Loop through forms and append form data to formData
      values.forms.forEach((form, index) => {
        formData.append(`forms[${index}][name]`, form.name);

        if (form.file && form.file instanceof File) {
 
          formData.append(`forms[${index}][file]`, form.file);
        } else if (!form.file) {
          formData.append(`forms[${index}][file]`, "");
        }

        formData.append(`forms[${index}][price]`, form.price);
        formData.append(`forms[${index}][description]`, form.description);
      });



      await dispatch(updateServiceThunk(formData)).unwrap();
      router.refresh();
      resetForm();
      onClose();
    } catch (err) {
      console.error("❌ Failed to update service:", err);
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
                Edit Service
              </Dialog.Title>

              <Formik
                enableReinitialize={true} // Allow reinitialization of form values
                initialValues={{
                  forms: serviceToEdit?.forms || [
                    { name: "", file: null, price: "", description: "" },
                  ], // Ensure fallback if serviceToEdit is null
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, values, setFieldValue }) => (
                  <Form className="mt-4 space-y-4">
                    <div>
                      <label className="block text-gray-700">Forms</label>
                      <FieldArray
                        name="forms"
                        render={(arrayHelpers) => (
                          <div>
                            {values.forms.map((_, index) => (
                              <div key={index} className="space-y-3">
                                <div>
                                  <label className="block text-gray-700">
                                    Form Name
                                  </label>
                                  <Field
                                    name={`forms[${index}].name`}
                                    className="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300"
                                  />
                                  <ErrorMessage
                                    name={`forms[${index}].name`}
                                    component="p"
                                    className="text-red-500 text-sm"
                                  />
                                </div>

                                <div>
                                  <label className="block text-gray-700">
                                    File
                                  </label>
                                  <input
                                    type="file"
                                    name={`forms[${index}].file`}
                                    onChange={(event) => {
                                      const file = event.target.files
                                        ? event.target.files[0]
                                        : null;
                                      setFieldValue(
                                        `forms[${index}].file`,
                                        file
                                      );
                                    }}
                                    className="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300"
                                  />
                                  <ErrorMessage
                                    name={`forms[${index}].file`}
                                    component="p"
                                    className="text-red-500 text-sm"
                                  />
                                </div>

                                <div>
                                  <label className="block text-gray-700">
                                    Price
                                  </label>
                                  <Field
                                    name={`forms[${index}].price`}
                                    className="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300"
                                  />
                                  <ErrorMessage
                                    name={`forms[${index}].price`}
                                    component="p"
                                    className="text-red-500 text-sm"
                                  />
                                </div>

                                <div>
                                  <label className="block text-gray-700">
                                    Description
                                  </label>
                                  <Field
                                    name={`forms[${index}].description`}
                                    className="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300"
                                  />
                                  <ErrorMessage
                                    name={`forms[${index}].description`}
                                    component="p"
                                    className="text-red-500 text-sm"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      />
                    </div>

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
                        {isSubmitting ? "Updating..." : "Edit Service"}
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
