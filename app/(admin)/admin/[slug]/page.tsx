import Client from "@/components/admin/pages/clients";
import Services from "@/components/admin/pages/services";
import Transaction from "@/components/admin/pages/transactions";
import TaxCalendar from "@/components/admin/pages/taxcalendar";
import Dashboard from "@/components/admin/pages/dashboard";
import Announcement from "@/components/admin/pages/announcements";
import ProofofTransaction from "@/components/admin/pages/proofoftransactions";
import DataLogger from "@/components/datalogger"; // New client component

import { cookies } from "next/headers"; // Import cookies API from Next.js

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type AdminPageData = {
  dashboard?: any; // Add the types you expect for these data
  taxform?: any;
  announcements?: any;
  proofs?: any;
  [key: string]: any; // For other dynamic properties
};

export default async function AdminPage({
  params, // Params will be passed in the URL
}: {
  params?: { slug?: string };
}) {
  if (!params || !params.slug) {
    return <p className="text-center mt-10 text-gray-500">Page not found</p>;
  }

  const { slug }: { slug?: string } = params as any;

  // Define the mapping of slug to components and prop keys
  const pageMap: Record<string, { component: React.FC<any>; propKey: string }> =
    {
      clients: { component: Client, propKey: "clients" },
      services: { component: Services, propKey: "services" },
      transactions: { component: Transaction, propKey: "transactions" },
      taxcalendar: { component: TaxCalendar, propKey: "events" },
      dashboard: { component: Dashboard, propKey: "stats" },
      announcements: { component: Announcement, propKey: "announcements" },
      proofoftransactions: {
        component: ProofofTransaction,
        propKey: "proofOfTransactions",
      },
    };

  const pageData = slug ? pageMap[slug] : undefined;

  if (!pageData) {
    return <p className="text-center mt-10 text-gray-500">Page not found</p>;
  }

  const { component: PageComponent, propKey } = pageData;

  // Access cookies on the server side using the `cookies()` function
  const cookieStore = cookies();
  const token = (await cookieStore).get("authToken");

  if (!token) {
    return <p className="text-center mt-10 text-gray-500">Unauthorized</p>;
  }

  let data: AdminPageData = {};
  let dashboardData = [];
  let taxformData = [];

  try {
    if (slug === "dashboard") {
      const dashboardRes = await fetch(`${API_URL}/api/dashboard`, {
        headers: {
          Authorization: `Bearer ${token.value}`, // Include token in headers
        },
        cache: "no-store",
      });

      const taxformRes = await fetch(`${API_URL}/api/taxcalendar`, {
        headers: {
          Authorization: `Bearer ${token.value}`, // Include token in headers
        },
        cache: "no-store",
      });

      if (dashboardRes.ok) {
        dashboardData = await dashboardRes.json();
      }

      if (taxformRes.ok) {
        taxformData = await taxformRes.json();
      }

      data = { dashboard: dashboardData, taxform: taxformData };
    } else {
      const res = await fetch(`${API_URL}/api/${slug}`, {
        headers: {
          Authorization: `Bearer ${token.value}`, // Include token in headers
        },
        cache: "no-store",
      });

      if (res.ok) {
        data = await res.json();
      }
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
  console.log(slug, token, data);
  return (
    <>
      <DataLogger data={data} />
      <PageComponent {...{ [propKey]: data || [] }} />
    </>
  );
}
