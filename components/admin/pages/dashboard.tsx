"use client";

export default function Dashboard() {
  return (
    <div className="p-6 bg-white shadow-md rounded-md w-full">
      <h2 className="text-2xl font-semibold">Dashboard</h2>
      <p className="text-gray-600 mt-2">Overview of your admin panel.</p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Example Cards */}
        <div className="p-4 bg-blue-100 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Users</h3>
          <p className="text-gray-700">1,230</p>
        </div>
        <div className="p-4 bg-green-100 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Revenue</h3>
          <p className="text-gray-700">$12,500</p>
        </div>
        <div className="p-4 bg-yellow-100 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Orders</h3>
          <p className="text-gray-700">320</p>
        </div>
      </div>
    </div>
  );
}
