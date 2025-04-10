import Client from "@/components/admin/pages/clients";
import Services from "@/components/admin/pages/services";
import Transaction from "@/components/admin/pages/transactions";
import TaxCalendar from "@/components/admin/pages/taxcalendar";
import Dashboard from "@/components/admin/pages/dashboard";
import Announcement from "@/components/admin/pages/announcements";
import ProofofTransaction from "@/components/admin/pages/proofoftransactions";
import DataLogger from "@/components/datalogger"; // New client component

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type AdminPageData = {
  dashboard?: any; // Add the types you expect for these data
  taxform?: any;
  announcements?: any;
  proofs?: any;
  [key: string]: any; // For other dynamic properties
};

export default async function AdminPage({
  params,
}: {
  params?: { slug?: string };
}) {
  // Ensure params are awaited before using its properties
  if (!params || !params.slug) {
    return <p className="text-center mt-10 text-gray-500">Page not found</p>;
  }

  // Type assertion
  const { slug }: { slug?: string } = params as any;

  // Define the mapping of slug to components and prop keys
  const pageMap: Record<string, { component: React.FC<any>; propKey: string }> =
    {
      clients: { component: Client, propKey: "clients" },
      services: { component: Services, propKey: "services" },
      transactions: { component: Transaction, propKey: "transactions" },
      taxcalendar: { component: TaxCalendar, propKey: "events" },
      dashboard: { component: Dashboard, propKey: "stats" },
      announcements: { component: Announcement, propKey: "announcements" }, // Added Announcement
      proofoftransactions: {
        component: ProofofTransaction,
        propKey: "proofOfTransactions",
      }, // Added ProofofTransaction
    };

  // Check if the pageData exists for the given slug
  const pageData = slug ? pageMap[slug] : undefined;

  if (!pageData) {
    return <p className="text-center mt-10 text-gray-500">Page not found</p>;
  }

  const { component: PageComponent, propKey } = pageData;

  // Define the API endpoints based on the slug
  let data: AdminPageData = {}; // Now we use the object type
  let dashboardData = [];
  let taxformData = [];

  try {
    if (slug === "dashboard") {
      // Fetch both dashboard and taxform data if the slug is "dashboard"
      const dashboardRes = await fetch(`${API_URL}/api/dashboard`, {
        cache: "no-store",
      });
      const taxformRes = await fetch(`${API_URL}/api/taxcalendar`, {
        cache: "no-store",
      });

      if (dashboardRes.ok) {
        dashboardData = await dashboardRes.json();
      }

      if (taxformRes.ok) {
        taxformData = await taxformRes.json();
      }

      // Combine both sets of data if necessary
      data = { dashboard: dashboardData, taxform: taxformData };
    } else {
      // Fetch data for other slugs
      const res = await fetch(`${API_URL}/api/${slug}`, {
        cache: "no-store",
      });

      if (res.ok) {
        data = await res.json();
      }
      console.log(data);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }

  console.log(slug, data, propKey);

  return (
    <>
      <DataLogger data={data} />
      <PageComponent {...{ [propKey]: data || [] }} />
    </>
  );
}
