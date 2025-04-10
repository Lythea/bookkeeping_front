export default function AboutUs() {
  return (
    <div className="flex flex-col bg-white">
      <main className="flex-grow flex items-center justify-center p-6 sm:p-8">
        {/* Centered Container with Full Height */}
        <div className="container w-[95%] bg-white shadow-2xl rounded-3xl p-6 sm:p-12 h-full flex items-center transition-transform hover:scale-[1.01] duration-300 ease-in-out">
          <section className="w-full flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
            {/* Title & Description */}
            <div className="w-full text-center md:text-left">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-700 leading-tight">
                Who We Are
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mt-4 leading-relaxed">
                We are a team dedicated to delivering high-quality solutions,
                helping businesses and individuals thrive in a rapidly evolving
                digital world. Our commitment to excellence drives us to go
                beyond expectations.
              </p>

              <h2 className="text-2xl sm:text-3xl font-semibold text-blue-600 mt-8">
                Our Mission
              </h2>
              <p className="text-base sm:text-lg text-gray-700 mt-2 leading-relaxed">
                To provide innovative, efficient, and reliable services that
                empower our clients to achieve their goals with confidence.
              </p>

              <h2 className="text-2xl sm:text-3xl font-semibold text-blue-600 mt-8">
                Our Values
              </h2>
              <ul className="text-base sm:text-lg text-gray-700 mt-4 space-y-3 list-disc list-inside">
                {[
                  {
                    title: "Integrity",
                    description:
                      "We uphold transparency and honesty in all our interactions.",
                  },
                  {
                    title: "Innovation",
                    description:
                      "We embrace change and continuously improve our solutions.",
                  },
                  {
                    title: "Customer-Centric",
                    description: "Our clients' success is our top priority.",
                  },
                  {
                    title: "Excellence",
                    description:
                      "We strive for the highest quality in everything we do.",
                  },
                ].map((value, index) => (
                  <li
                    key={index}
                    className="hover:bg-blue-50 px-4 py-2 rounded-md transition-colors duration-200"
                  >
                    <strong>{value.title}:</strong> {value.description}
                  </li>
                ))}
              </ul>
            </div>

            {/* Image/Visual Placeholder */}
            <div className="w-full md:w-1/2 flex justify-center md:justify-end mt-8 md:mt-0">
              <img
                src="/aboutus.avif"
                alt="Our Team"
                className="w-full max-w-[400px] sm:max-w-[500px] rounded-lg shadow-lg transition-transform hover:scale-105 duration-300"
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
