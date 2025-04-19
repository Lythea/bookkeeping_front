import Client from "@/components/admin/pages/clients";
import Services from "@/components/admin/pages/services";
import Transaction from "@/components/admin/pages/transactions";
import TaxCalendar from "@/components/admin/pages/taxcalendar";
import Dashboard from "@/components/admin/pages/dashboard";

import DataLogger from "@/components/datalogger"; // New client component

import { cookies } from "next/headers"; // Import cookies API from Next.js

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type AdminPageData = {
  dashboard?: any; // Add the types you expect for these data
  taxform?: any;
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
  let servicesData = [];
  try {
    if (slug === "dashboard") {
      const [dashboardRes, taxformRes, transactionsRes] = await Promise.all([
        fetch(`${API_URL}/api/dashboard`, {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
          cache: "no-store",
        }),
        fetch(`${API_URL}/api/taxcalendar`, {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
          cache: "no-store",
        }),
        fetch(`${API_URL}/api/transactions`, {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
          cache: "no-store",
        }),
      ]);

      if (dashboardRes.ok) {
        dashboardData = await dashboardRes.json();
      }

      if (taxformRes.ok) {
        taxformData = await taxformRes.json();
      }

      const transactionsData = transactionsRes.ok
        ? await transactionsRes.json()
        : [];

      data = {
        dashboard: dashboardData,
        taxform: taxformData,
        transactions: transactionsData, // ✅ added transactions data here
      };
    } else if (slug === "transactions") {
      const [transactionsRes, clientsRes, servicesRes] = await Promise.all([
        fetch(`${API_URL}/api/transactions`, {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
          cache: "no-store",
        }),
        fetch(`${API_URL}/api/clients`, {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
          cache: "no-store",
        }),
        fetch(`${API_URL}/api/services`, {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
          cache: "no-store",
        }),
      ]);
      const transactionsData = transactionsRes.ok
        ? await transactionsRes.json()
        : [];

      const clientsData = clientsRes.ok ? await clientsRes.json() : [];

      const servicesData = servicesRes.ok ? await servicesRes.json() : [];

      data = {
        transactions: transactionsData,
        clients: clientsData,
        services: servicesData,
      };
    } else if (slug === "taxcalendar") {
      // Fetch services data when slug is "taxcalendar"
      const servicesRes = await fetch(`${API_URL}/api/services`, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
        cache: "no-store",
      });

      const taxformRes = await fetch(`${API_URL}/api/taxcalendar`, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
        cache: "no-store",
      });

      if (servicesRes.ok) {
        servicesData = await servicesRes.json();
      } else {
        console.log("Failed to fetch services");
      }

      if (taxformRes.ok) {
        taxformData = await taxformRes.json();
      } else {
        console.log("Failed to fetch taxcalendar");
      }

      data = {
        events: taxformData,
        services: servicesData, // Add services data
      };
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
  console.log(data);

  return (
    <>
      <DataLogger data={data} />
      <PageComponent {...{ [propKey]: data || [] }} />
    </>
  );
}
