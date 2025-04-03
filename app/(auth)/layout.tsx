"use client";

import { useParams } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { slug } = useParams();
  console.log("Auth Layout Slug:", slug);

  return <main className="">{children}</main>;
}
