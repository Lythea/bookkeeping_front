import Client from "@/components/admin/pages/clients";
import Services from "@/components/admin/pages/services";
import Inquiry from "@/components/admin/pages/inquiries";
import Transaction from "@/components/admin/pages/transactions";
import TaxCalendar from "@/components/admin/pages/taxcalendar";
import Dashboard from "@/components/admin/pages/dashboard";
import DataLogger from "@/components/datalogger"; // New client component

export default async function AdminPage({
  params,
}: {
  params?: { slug?: string };
}) {  
  // Ensure params are awaited before using
  if (!params || !params.slug) {
    return <p className="text-center mt-10 text-gray-500">Page not found</p>;
  }

  const { slug } = params;

  const pageMap: Record<string, { component: React.FC<any>; propKey: string }> =
    {
      clients: { component: Client, propKey: "clients" },
      services: { component: Services, propKey: "services" },
      inquiries: { component: Inquiry, propKey: "inquiries" },
      transactions: { component: Transaction, propKey: "transactions" },
      taxcalendar: { component: TaxCalendar, propKey: "events" },
      dashboard: { component: Dashboard, propKey: "stats" },
    };

  const pageData = pageMap[slug];

  if (!pageData) {
    return <p className="text-center mt-10 text-gray-500">Page not found</p>;
  }

  const { component: PageComponent, propKey } = pageData;

  let data = [];

  try {
    const res = await fetch(`http://localhost:8000/api/${slug}`, {
      cache: "no-store",
    });

    if (res.ok) {
      data = await res.json();
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
  console.log(slug, data);
  return (
    <>
      <DataLogger data={data} />
      <PageComponent {...{ [propKey]: data || [] }} />
    </>
  );
}
