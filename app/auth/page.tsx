"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Cookies from "universal-cookie";
import { useRouter } from "next/navigation";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Login: React.FC = () => {
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
    setErrorMessage("");

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        if (!cookies.get("authToken")) {
          const decodedToken = decodeURIComponent(data.token); // Decode if necessary
          cookies.set("authToken", decodedToken, {
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
            secure: true,
            sameSite: "none",
          });
        }

        setIsLoading(false);
        router.push("/admin");
      } else {
        setIsLoading(false);
        setErrorMessage(
          data.message ||
            "Login failed. Please check your credentials and try again."
        );
      }
    } catch (error) {
      setIsLoading(false);
      if (error instanceof Error) {
        setErrorMessage(`An error occurred: ${error.message}`);
      } else {
        setErrorMessage("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 sm:p-8 md:p-10 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Image
            src="/logo/logoround.png"
            alt="W&E Guarantee Bookkeeping Services Logo"
            width={120}
            height={40}
            className="rounded-full"
          />
          <Link href="/">
            <h1 className="text-xl font-bold text-black text-center">
              W&E Guarantee Bookkeeping Services
            </h1>
          </Link>
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

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
      </div>
    </div>
  );
};

export default Login;
