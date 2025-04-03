"use client";

import { useParams } from "next/navigation";
import Login from "@/components/auth/login";
export default function AuthPage() {
  const { slug } = useParams();
  console.log(slug);
  return <>{slug === "login" && <Login />}</>;
}
