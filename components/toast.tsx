"use client";

import { Toaster, toast } from "react-hot-toast";

export const showToast = (
  message: string,
  type: "success" | "error" | "info"
) => {
  const toastOptions = {
    success: () => toast.success(message),
    error: () => toast.error(message),
    info: () => toast(message),
  };

  return toastOptions[type]();
};

export default function ToastProvider() {
  return <Toaster position="top-right" />;
}
