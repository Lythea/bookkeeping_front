"use client";
import { useState, useEffect } from "react";
import { FiAlertCircle } from "react-icons/fi"; // Import the alert icon

export default function Dashboard({ stats }: { stats: any }) {
  const [transactionStatusCounts, setTransactionStatusCounts] = useState<any>({
    Pending: 0,
    Completed: 0,
    Cancelled: 0,
  });
  const [taxForms, setTaxForms] = useState<any>([]);
  const [selectedTaxForm, setSelectedTaxForm] = useState<any>(null); // To track selected tax form
  const [transactionDetails, setTransactionDetails] = useState<any>(null); // To store transaction details for the popup

  // UseEffect to calculate transaction status counts
  useEffect(() => {
    const statusCounts = stats.dashboard.status_counts || {};
    setTransactionStatusCounts({
      Pending: statusCounts["Pending"] || 0,
      Completed: statusCounts["Completed"] || 0,
      Cancelled: statusCounts["Cancelled"] || 0,
    });

    // Extract tax form data and calculate remaining days
    const formData = stats.taxform.map((form: any) => {
      const dueDate = new Date(form.due_date);
      const today = new Date();
      const timeDiff = dueDate.getTime() - today.getTime();
      const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convert milliseconds to days

      return { ...form, daysLeft };
    });

    setTaxForms(formData);
  }, [stats]);

  const handleTaxFormClick = (form: any) => {
    // Find the matching transaction based on form number in inquiries
    const matchedTransaction = stats.transactions.find(
      (transaction: any) =>
        transaction.inquiries.some(
          (inquiry: any) => inquiry.name === form.form_no
        ) // Match form_no with inquiry name
    );

    if (matchedTransaction) {
      // If a match is found, set transaction details for the popup
      const inquiry = matchedTransaction.inquiries.find(
        (inquiry: any) => inquiry.name === form.form_no // Match the specific inquiry by form number
      );

      setTransactionDetails({
        name: matchedTransaction.name, // The name of the client
        businessName: matchedTransaction.business_name, // Business name
        tinId: matchedTransaction.tin_id, // TIN ID
      });
    } else {
      setTransactionDetails(null); // No transaction match found, clear the details
    }

    // Set the selected tax form for visual representation
    setSelectedTaxForm(form);
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md w-full">
      <h2 className="text-2xl font-semibold">Dashboard</h2>
      <p className="text-gray-600 mt-2">Overview of your admin panel.</p>

      {/* Stats Cards */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-4 bg-neutral-100 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Clients</h3>
          <p className="text-gray-700">{stats.dashboard.total_clients}</p>
        </div>

        <div className="p-4 bg-neutral-100 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Services</h3>
          <p className="text-gray-700">{stats.dashboard.total_services}</p>
        </div>

        <div className="p-4 bg-neutral-100 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Tax Forms</h3>
          <p className="text-gray-700">{stats.dashboard.total_tax_forms}</p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-neutral-100 rounded-lg shadow">
        <h3 className="text-lg font-semibold">Total Transactions</h3>
        <p className="text-gray-700">{stats.dashboard.total_transactions}</p>

        {/* Transaction Status Overview */}
        {transactionStatusCounts && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {["Pending", "Completed", "Cancelled"].map((status) => (
              <div
                key={status}
                className="p-4 bg-white rounded-lg shadow flex flex-col items-center"
              >
                <h4 className="text-lg font-semibold capitalize">{status}</h4>
                <p className="text-gray-700">
                  {transactionStatusCounts[status]}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tax Forms Section with 5 Columns */}
      <div className="mt-6 p-4 bg-neutral-100 rounded-lg shadow">
        <h3 className="text-lg font-semibold">Tax Forms</h3>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {taxForms.map((form: any) => (
            <div
              key={form.id}
              className="relative p-4 bg-white rounded-lg shadow cursor-pointer"
              onClick={() => handleTaxFormClick(form)}
            >
              {/* Display the alert icon if days left is 7 or fewer */}
              {form.daysLeft <= 7 && (
                <div className="absolute top-2 right-2 text-red-500">
                  <FiAlertCircle size={24} />
                </div>
              )}
              <h4 className="text-lg font-semibold">Form: {form.form_no}</h4>
              <p className="text-gray-700">Due Date: {form.due_date}</p>
              <p className="text-gray-700">Days Left: {form.daysLeft} days</p>
            </div>
          ))}
        </div>
      </div>

      {/* Popup Container */}
      {selectedTaxForm && transactionDetails && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h4 className="text-xl font-semibold mb-4">Transaction Details</h4>
            <p className="text-gray-700">
              Clients Name: {transactionDetails.name}
            </p>
            <p className="text-gray-700">
              Business Name: {transactionDetails.businessName}
            </p>
            <p className="text-gray-700">TIN ID: {transactionDetails.tinId}</p>
            <button
              onClick={() => setSelectedTaxForm(null)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
