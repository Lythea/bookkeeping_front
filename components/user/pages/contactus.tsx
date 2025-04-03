export default function ContactUs() {
  return (
    <div className="flex flex-col bg-white">
      <main className="flex-grow flex items-center justify-center p-6 sm:p-8">
        {/* Centered Container with Full Height */}
        <div className="container w-[95%] bg-white shadow-2xl rounded-3xl p-6 sm:p-12 h-full flex items-center transition-transform hover:scale-[1.01] duration-300 ease-in-out">
          <section className="w-full flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
            {/* Title & Description */}
            <div className="w-full">
              <h1 className="text-3xl md:text-5xl font-extrabold text-blue-700 leading-snug md:leading-tight">
                Contact Us
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mt-4 leading-relaxed">
                Reach out to us for inquiries, support, or any business-related
                concerns.
              </p>

              <h2 className="text-2xl md:text-3xl font-semibold text-blue-600 mt-6 md:mt-8">
                Get In Touch
              </h2>

              <ul className="text-base md:text-lg text-gray-700 mt-4 space-y-4">
                {/* Email */}
                <li className="flex flex-col md:flex-row items-start md:items-center space-y-1 md:space-y-0 md:space-x-2 p-3 rounded-md hover:bg-blue-50 transition">
                  <strong>Email:</strong>
                  <a
                    href="mailto:webs.sanjuanbatangas@gmail.com"
                    className="text-blue-600 hover:underline break-words"
                  >
                    webs.sanjuanbatangas@gmail.com
                  </a>
                </li>

                {/* Phone */}
                <li className="flex flex-col md:flex-row items-start md:items-center space-y-1 md:space-y-0 md:space-x-2 p-3 rounded-md hover:bg-blue-50 transition">
                  <strong>Phone:</strong>
                  <span>0916-286-5399 / 0915-113-3693</span>
                </li>

                {/* Location */}
                <li className="flex flex-col md:flex-row items-start md:items-center space-y-1 md:space-y-0 md:space-x-2 p-3 rounded-md hover:bg-blue-50 transition">
                  <strong>Location:</strong>
                  <span>Pastor Avenue, Pallocan West, Batangas City</span>
                </li>

                {/* Facebook */}
                <li className="flex flex-col md:flex-row items-start md:items-center space-y-1 md:space-y-0 md:space-x-2 p-3 rounded-md hover:bg-blue-50 transition">
                  <strong>Facebook:</strong>
                  <a
                    href="https://www.facebook.com/profile.php?id=61553389666414"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Visit our Facebook Page
                  </a>
                </li>
              </ul>
            </div>

            {/* Google Maps Embed */}
            <div className="w-full flex justify-center mt-6 md:mt-0 md:w-1/2">
              <iframe
                className="w-full h-72 md:h-[550px] md:w-[550px] rounded-lg shadow-lg transition-transform hover:scale-105 duration-300"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.4084802089656!2d121.06285087576387!3d13.754222897236117!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33bd05fb8633ebc3%3A0x2bf06410cb4f1591!2sW%26E%20Guarantee%20I%20Bookkeeping%20Services!5e0!3m2!1sen!2sph!4v1742301320275!5m2!1sen!2sph"
                loading="lazy"
                allowFullScreen
              ></iframe>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
