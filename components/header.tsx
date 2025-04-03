"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa"; // Import icons for the menu

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-blue-700 to-violet-700 text-white p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo on the left */}
        <div className="flex items-center gap-3">
          <Image
            src="/logo/MainLogo-rounded.png"
            alt="W&E Guarantee Bookkeeping Services Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <Link href="/">
            <h1 className="text-xl font-bold">
              W&E Guarantee Bookkeeping Services
            </h1>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:block">
          <ul className="flex space-x-6 text-sm font-medium">
            <li>
              <Link href="/aboutus" className="hover:underline">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/service" className="hover:underline">
                Services
              </Link>
            </li>
            <li>
              <Link href="/announcement" className="hover:underline">
                Announcement
              </Link>
            </li>
            <li>
              <Link href="/appointment" className="hover:underline">
                Appointment
              </Link>
            </li>
            <li>
              <Link href="/proofoftransaction" className="hover:underline">
                Proof of Transaction
              </Link>
            </li>
            <li>
              <Link href="/contactus" className="hover:underline">
                Contact Us
              </Link>
            </li>
          </ul>
        </nav>

        {/* Mobile Navbar Toggle Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white text-2xl focus:outline-none"
        >
          {menuOpen ? <FaTimes /> : <FaBars />} {/* Toggle Icon */}
        </button>
      </div>

      {/* Mobile Navigation Menu (Hidden by Default) */}
      <nav
        className={`md:hidden absolute top-28 left-0 w-full bg-white shadow-lg transition-transform duration-300 ease-in-out z-50 ${
          menuOpen ? "block" : "hidden"
        }`}
      >
        <ul className="flex flex-col items-center py-4 space-y-4 text-gray-800">
          <li>
            <Link
              href="/aboutus"
              className="hover:text-blue-600"
              onClick={() => setMenuOpen(false)}
            >
              About Us
            </Link>
          </li>
          <li>
            <Link
              href="/service"
              className="hover:text-blue-600"
              onClick={() => setMenuOpen(false)}
            >
              Services
            </Link>
          </li>
          <li>
            <Link
              href="/announcement"
              className="hover:text-blue-600"
              onClick={() => setMenuOpen(false)}
            >
              Announcement
            </Link>
          </li>
          <li>
            <Link
              href="/appointment"
              className="hover:text-blue-600"
              onClick={() => setMenuOpen(false)}
            >
              Appointment
            </Link>
          </li>
          <li>
            <Link
              href="/proofoftransaction"
              className="hover:text-blue-600"
              onClick={() => setMenuOpen(false)}
            >
              Proof of Transaction
            </Link>
          </li>
          <li>
            <Link
              href="/contactus"
              className="hover:text-blue-600"
              onClick={() => setMenuOpen(false)}
            >
              Contact Us
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
