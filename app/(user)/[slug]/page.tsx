import Header from "@/components/header";
import Footer from "@/components/footer";
import AboutUs from "@/components/user/pages/aboutus";
import Service from "@/components/user/pages/services";
import Announcement from "@/components/user/pages/announcement";
import ContactUs from "@/components/user/pages/contactus";
import Appointment from "@/components/user/pages/appointment";
import ProofofTransaction from "@/components/user/pages/proofoftransaction";

type PageProps = {
  params: {
    slug: string;
  };
};

const Page = async ({ params }: PageProps) => {
  const { slug } = params;
  console.log(slug);

  // Initialize data
  let data = [];
  let servicesData = [];

  try {
    // Fetch data based on the slug
    const res = await fetch(`http://localhost:8000/api/${slug}`, {
      cache: "no-store", // Ensures data is not cached
    });

    if (res.ok) {
      data = await res.json();
    }

    // If slug is "appointment", also fetch services data
    if (slug === "appointment") {
      const servicesRes = await fetch("http://localhost:8000/api/services", {
        cache: "no-store", // Ensures data is not cached
      });

      if (servicesRes.ok) {
        data = await servicesRes.json();
      }
      console.log(data);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  return (
    <main className="flex-grow flex items-center justify-center">
      {slug === "aboutus" && <AboutUs />}
      {slug === "service" && <Service />}
      {slug === "announcement" && <Announcement />}
      {slug === "contactus" && <ContactUs />}
      {slug === "proofoftransaction" && <ProofofTransaction />}
      {slug === "appointment" && <Appointment data={data} />}
    </main>
  );
};

export default Page;
