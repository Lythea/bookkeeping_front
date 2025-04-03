export default function Announcement() {
  const announcements = [
    {
      id: 1,
      title: "Office Closure on Holidays",
      date: "March 25, 2025",
      description:
        "Our office will be closed on March 25th for the holiday. Regular operations resume the next day.",
    },
    {
      id: 2,
      title: "New Online Services Launched",
      date: "March 20, 2025",
      description:
        "We have added new online services for business registration and tax filing. Check them out today!",
    },
    {
      id: 3,
      title: "Tax Filing Deadline Approaching",
      date: "March 15, 2025",
      description:
        "Make sure to submit your tax documents before the deadline to avoid penalties.",
    },
    {
      id: 4,
      title: "System Maintenance Schedule",
      date: "March 10, 2025",
      description:
        "We will have a scheduled system maintenance from 12 AM to 4 AM.",
    },
    {
      id: 5,
      title: "New Office Branch Opening",
      date: "April 5, 2025",
      description:
        "We're excited to announce our new office branch opening in Makati City!",
    },
    {
      id: 6,
      title: "Client Support Hours Update",
      date: "April 10, 2025",
      description:
        "Our support hours are now extended until 8 PM for better assistance.",
    },
    {
      id: 7,
      title: "Annual Company Conference",
      date: "April 15, 2025",
      description:
        "Join us for our annual company conference to discuss upcoming innovations.",
    },
    {
      id: 8,
      title: "Employee Recognition Day",
      date: "April 20, 2025",
      description:
        "We will be celebrating the hard work and dedication of our employees.",
    },
  ];

  return (
    <div className="flex flex-col bg-white">
      <main className="flex-grow flex items-center justify-center p-6 sm:p-8">
        {/* Centered Container with Full Height */}
        <div className="container w-[95%] bg-white shadow-2xl rounded-3xl p-6 sm:p-12 h-full flex items-center transition-transform hover:scale-[1.01] duration-300 ease-in-out">
          <section className="w-full flex flex-col items-center justify-between gap-8 md:gap-12">
            {/* Title & Description */}
            <div className="w-full">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-700 leading-tight text-center">
                Latest Announcements
              </h1>
              <p className="text-base sm:text-lg text-gray-600 mt-2 leading-relaxed text-center">
                Stay updated with our latest news, office updates, and important
                deadlines.
              </p>

              <h2 className="text-2xl sm:text-3xl font-semibold text-blue-600 mt-8 text-center">
                Recent Updates
              </h2>

              {/* 1-Column Layout for Small, 2 for Medium, 3 for Large, 4 for XL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                {announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-md hover:bg-blue-50 transition-transform duration-300 hover:scale-105"
                  >
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                      {announcement.title}
                    </h3>
                    <p className="text-sm text-gray-500">{announcement.date}</p>
                    <p className="text-sm sm:text-base text-gray-600 mt-2">
                      {announcement.description}
                    </p>
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
