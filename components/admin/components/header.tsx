"use client";
import { useRouter } from "next/navigation";
import Cookies from "universal-cookie";

export default function Header() {
  const router = useRouter();
  const cookies = new Cookies(); // Create an instance of Cookies

  const handleLogout = () => {
    // Iterate over all cookies and remove each one
    Object.keys(cookies.getAll()).forEach((cookieName) => {
      cookies.remove(cookieName, { path: "/" });
    });
    router.push("/"); // Redirect to the homepage
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
