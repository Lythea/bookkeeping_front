"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Main Content (Pushes Footer Down) */}
      <main className="flex-grow flex items-center justify-center p-6 ">
        {children}
      </main>

      <Footer />
    </div>
  );
}
