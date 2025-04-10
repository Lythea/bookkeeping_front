import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Cookies from "universal-cookie";
import { useRouter } from "next/navigation";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const cookies = new Cookies();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading) return;

    setIsLoading(true);
    setErrorMessage(""); // Reset error message before making the request

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
        credentials: "include", // Ensure cookies are included in cross-origin requests
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (response.ok) {
        // If login is successful, set the authentication token in cookies
        if (!cookies.get("authToken")) {
          cookies.set("authToken", data.token, {
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            secure: true, // Important for https
            sameSite: "none", // Needed for cross-origin cookies
          });
        }

        setIsLoading(false);
        onClose(); // Close the login modal
        router.push("/admin"); // Redirect to the admin page
      } else {
        setIsLoading(false);
        setErrorMessage(
          data.message ||
            "Login failed. Please check your credentials and try again."
        );
        console.error("Login error:", data);
      }
    } catch (error) {
      setIsLoading(false);

      // More granular error handling
      if (error instanceof Error) {
        setErrorMessage(`An error occurred: ${error.message}`);
        console.error("Error details:", error.stack);
      } else {
        setErrorMessage("An error occurred. Please try again later.");
        console.error("Unknown error:", error);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 sm:p-8 md:p-10 rounded-lg shadow-lg max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center gap-3">
          <Image
            src="/logo/logoround.png"
            alt="W&E Guarantee Bookkeeping Services Logo"
            width={120}
            height={40}
            className="rounded-full"
          />
          <Link href="/">
            <h1 className="text-xl font-bold text-black">
              W&E Guarantee Bookkeeping Services
            </h1>
          </Link>
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible size={20} />
              ) : (
                <AiOutlineEye size={20} />
              )}
            </button>
          </div>
          {errorMessage && (
            <div className="text-red-500 text-center">{errorMessage}</div>
          )}
          <button
            type="submit"
            className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="text-blue-500 hover:underline focus:outline-none"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
