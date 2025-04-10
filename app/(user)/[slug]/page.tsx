import AboutUs from "@/components/user/pages/aboutus";
import Service from "@/components/user/pages/services";
import Announcement from "@/components/user/pages/announcement";
import ContactUs from "@/components/user/pages/contactus";
import Appointment from "@/components/user/pages/appointment";
import ProofofTransaction from "@/components/user/pages/proofoftransaction";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default async function Page({ params }: { params?: { slug?: string } }) {
  // Guard clause for missing or undefined slug
  if (!params || !params.slug) {
    return <p className="text-center mt-10 text-gray-500">Page not found</p>;
  }

  const { slug } = params;

  const pageMap: Record<
    string,
    { component: React.FC<any>; apiEndpoint: string }
  > = {
    aboutus: { component: AboutUs, apiEndpoint: "/aboutus" },
    service: { component: Service, apiEndpoint: "/services" },
    announcement: { component: Announcement, apiEndpoint: "/announcements" },
    contactus: { component: ContactUs, apiEndpoint: "/contactus" },
    appointment: { component: Appointment, apiEndpoint: "/services" },
    proofoftransaction: {
      component: ProofofTransaction,
      apiEndpoint: "/proofoftransactions",
    },
  };

  const pageData = pageMap[slug];

  if (!pageData) {
    return <p className="text-center mt-10 text-gray-500">Page not found</p>;
  }

  const { component: PageComponent, apiEndpoint } = pageData;
  console.log(apiEndpoint);
  let data = [];

  try {
    const res = await fetch(`${API_URL}/api${apiEndpoint}`, {
      cache: "no-store",
    });

    if (res.ok) {
      data = await res.json();
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  console.log(apiEndpoint, data);
  return (
    <main className="flex-grow flex items-center justify-center">
      <PageComponent data={data} />
    </main>
  );
}
