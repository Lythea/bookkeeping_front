export default function Services() {
  const services = [
    {
      id: 1,
      title: "Business Permit and Licensing Office",
      description: "Processing and renewal of business permits.",
    },
    {
      id: 2,
      title: "BIR Registration",
      description: "Assistance with tax identification and registration.",
    },
    {
      id: 3,
      title: "DTI/SEC Registration",
      description: "Business name and corporate entity registration.",
    },
    {
      id: 4,
      title: "Building Permit",
      description: "Permit processing for construction projects.",
    },
    {
      id: 5,
      title: "RDO Transfer",
      description: "Change your Revenue District Office (RDO).",
    },
    {
      id: 6,
      title: "Bookkeeping Assistance",
      description: "Maintain accurate financial records.",
    },
    {
      id: 7,
      title: "ITR Assistance",
      description: "Filing and preparation of Income Tax Returns.",
    },
    {
      id: 8,
      title: "Authority to Print of Receipts",
      description: "Secure approval for printing official receipts.",
    },
    {
      id: 9,
      title: "Accredited Printer Services",
      description: "Printing of official receipts, invoices, and more.",
    },
    {
      id: 10,
      title: "Certificate of Registration Update",
      description: "Modify or update business registration details.",
    },
    {
      id: 11,
      title: "SSS, PhilHealth, Pag-IBIG Registration",
      description: "Employee and business social benefit registration.",
    },
    {
      id: 12,
      title: "Online Services Assistance",
      description: "Help with PSA, CENOMAR, passport, and NBI requests.",
    },
  ];

  return (
    <div className="flex flex-col bg-white">
      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 md:p-8">
        {/* Centered Container with Full Height */}
        <div className="container w-[95%] bg-white shadow-2xl rounded-3xl p-6 sm:p-8 md:p-12 h-full flex items-center transition-transform hover:scale-[1.01] duration-300 ease-in-out">
          <section className="w-full flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-10 md:gap-12">
            {/* Title & Description */}
            <div className="w-full">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-700 leading-tight text-center">
                Our Services
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mt-3 sm:mt-4 leading-relaxed text-center">
                We offer a range of bookkeeping and financial services to help
                businesses manage their finances efficiently.
              </p>

              <h2 className="text-2xl sm:text-3xl font-semibold text-blue-600 mt-6 sm:mt-8 text-center">
                What We Offer
              </h2>

              {/* Grid Layout for Services */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-4 sm:mt-6">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-start bg-gray-50 p-4 rounded-md shadow-sm transition-transform hover:scale-105 duration-300 cursor-pointer"
                  >
                    <div>
                      <h3 className="text-md sm:text-lg font-semibold text-gray-800">
                        {service.title}
                      </h3>
                      <p className="text-sm sm:text-md text-gray-600 mt-1">
                        {service.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
