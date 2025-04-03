"use client";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "role=; Max-Age=0"; // Clear auth cookie
    router.push("/"); // Redirect to homepage or login
  };

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h2 className="text-lg font-semibold">Admin Dashboard</h2>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </header>
  );
}
