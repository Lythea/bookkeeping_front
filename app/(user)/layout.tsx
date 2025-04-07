"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { Provider } from "react-redux";
import { store } from "@/app/redux/store"; // Import your Redux store

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Provider store={store}>
        {/* Main Content (Pushes Footer Down) */}
        <main className="flex-grow flex items-center justify-center p-6 ">
          {children}
        </main>
      </Provider>
      <Footer />
    </div>
  );
}
