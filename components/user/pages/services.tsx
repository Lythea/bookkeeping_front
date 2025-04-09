import { FaFileAlt, FaRegMoneyBillAlt } from "react-icons/fa"; // Importing icons for file and price

interface ServiceProps {
  data: Array<{
    id: number;
    service: string;
    forms: Array<{
      name: string;
      description: string;
      price: string;
      file: string;
    }>;
  }>;
}

export default function Services({ data }: ServiceProps) {
  console.log(data);

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
                {data.map((service) => (
                  <div
                    key={service.id}
                    className="flex flex-col bg-gray-50 p-4 rounded-md shadow-lg transition-transform hover:scale-105 duration-300 cursor-pointer h-full"
                  >
                    {/* Service Title */}
                    <div className="flex items-center w-full  h-10">
                      <h3 className="text-md sm:text-lg font-semibold text-gray-800 text-ellipsis overflow-hidden  w-full">
                        {service.service}
                      </h3>
                    </div>

                    {/* Render each form associated with the service */}
                    <div className="mt-2 w-full flex-grow">
                      {service.forms.map((form, index) => (
                        <div
                          key={index}
                          className="bg-white p-4 mb-4 rounded-md shadow-sm"
                        >
                          {/* Form Title */}
                          <div className="flex items-center gap-2 mb-3">
                            <FaFileAlt className="text-blue-600" />
                            <h4 className="text-lg font-semibold text-blue-700">
                              {form.name}
                            </h4>
                          </div>
                          {/* Form Description */}
                          <p className="text-md text-gray-600 mt-2 mb-3">
                            {form.description}
                          </p>
                          {/* Form Price */}
                          <div className="flex items-center gap-2 mt-3">
                            <FaRegMoneyBillAlt className="text-green-600" />
                            <p className="text-sm text-gray-500">
                              Price: ${form.price}
                            </p>
                          </div>
                        </div>
                      ))}
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
