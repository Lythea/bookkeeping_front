"use client";

import React from "react";
import Sidebar from "@/components/admin/components/sidebar";
import Header from "@/components/admin/components/header";
import { Provider } from "react-redux";
import { store } from "@/app/redux/store"; // Import your Redux store

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <div className="flex h-fit">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Header />
          <main className="flex-grow p-6 bg-gray-100">{children}</main>
        </div>
      </div>
    </Provider>
  );
}
