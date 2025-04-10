import Header from "@/components/header";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 bg-white">
        {/* Centered Container with Full Height */}
        <div className="container w-[95%] sm:max-w-[90%] md:max-w-[80%] bg-white shadow-2xl rounded-lg p-6 sm:p-10 h-full min-h-[70vh] flex items-center">
          <section className="w-full flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-6 sm:gap-8">
            {/* Title & Description */}
            <div className="w-full md:w-1/2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-700 leading-tight">
                W&E Guarantee Bookkeeping Services
              </h1>
              <p className="text-lg sm:text-xl text-gray-700 mt-3 sm:mt-4 leading-relaxed">
                We provide reliable and professional bookkeeping services to
                help you manage your finances efficiently. From bank
                reconciliation to tax preparation, we ensure accuracy and
                compliance for your business.
              </p>
            </div>

            {/* Responsive Embedded Video */}
            <div className="w-full md:w-1/2">
              <div className="relative w-full aspect-video md:h-[450px]">
                <iframe
                  className="w-full h-full rounded-lg shadow-md"
                  src="https://www.youtube.com/embed/rN8fHFBHhCE"
                  title="Bookkeeping Introduction"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
