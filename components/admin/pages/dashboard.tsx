"use client";
import { useState, useEffect } from "react";

export default function Dashboard({ stats }: { stats: any }) {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [taxFormToNotify, setTaxFormToNotify] = useState<any | null>(null);

  useEffect(() => {
    console.log("Received stats:", stats);

    const upcomingTaxForm = stats.taxform.find((form: any) => {
      const today = new Date();
      const dueDate = new Date(form.due_date);
      return dueDate.getTime() - today.getTime() <= 3 * 24 * 60 * 60 * 1000;
    });

    if (upcomingTaxForm) {
      setTaxFormToNotify(upcomingTaxForm);
      setShowPopup(true);
    }
  }, [stats]);

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

        {stats.dashboard.status_counts && stats.dashboard.transact_counts && (
          <div className="mt-6 flex flex-col lg:flex-row gap-6">
            {/* Form Status Overview */}
            <div className="flex-1 p-4 bg-white rounded-lg shadow space-y-4">
              <h3 className="text-xl font-semibold">
                Transaction Status Overview
              </h3>
              <div className="space-y-4">
                {Object.keys(stats.dashboard.status_counts).map((status) => {
                  return (
                    <div key={status} className={`p-4 rounded-lg shadow `}>
                      <h4 className="text-lg font-semibold capitalize">
                        {status}
                      </h4>
                      <p>{stats.dashboard.status_counts[status] || 0}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Transaction Status Overview */}
            <div className="flex-1 p-4 bg-white rounded-lg shadow space-y-4">
              <h3 className="text-xl font-semibold">
                Transaction Transact Overview
              </h3>
              <div className="space-y-4">
                {Object.keys(stats.dashboard.transact_counts).map((status) => {
                  return (
                    <div key={status} className={`p-4 rounded-lg shadow `}>
                      <h4 className="text-lg font-semibold capitalize">
                        {status}
                      </h4>
                      <p>{stats.dashboard.transact_counts[status] || 0}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tax Form Notification Popup */}
      {showPopup && taxFormToNotify && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold">Upcoming Tax Form Due</h2>
            <p className="mt-2">Form: {taxFormToNotify.form_name}</p>
            <p>Due Date: {taxFormToNotify.due_date}</p>
            <p>Latest Revision: {taxFormToNotify.latest_revision_date}</p>
            <button
              className="mt-4 bg-blue-500 text-white p-2 rounded"
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
