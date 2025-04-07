"use client";

import { usePathname, useRouter } from "next/navigation";

const menuItems = [
  { name: "Dashboard", path: "/admin/dashboard" },
  { name: "Clients", path: "/admin/clients" },
  { name: "Services", path: "/admin/services" },
  { name: "Transactions", path: "/admin/transactions" },
  { name: "Tax Calendar", path: "/admin/taxcalendar" },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname(); // Get current route

  return (
    <aside className="w-64 bg-gray-800 text-white h-screen p-5">
      <h1 className="text-xl font-bold mb-5">Admin Panel</h1>
      <ul>
        {menuItems.map((item) => (
          <li key={item.path}>
            <button
              onClick={() => router.push(item.path)} // Navigate to route
              className={`block w-full text-left p-3 rounded transition ${
                pathname === item.path ? "bg-gray-700" : "hover:bg-gray-700"
              }`}
            >
              {item.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
