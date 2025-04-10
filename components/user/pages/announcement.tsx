interface AnnouncementType {
  id: number;
  title: string;
  date: string;
  description: string;
}

interface AnnouncementProps {
  data: AnnouncementType[];
}

export default function Announcement({ data }: AnnouncementProps) {

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(dateString));
  };

  return (
    <div className="flex flex-col bg-white">
      <main className="flex-grow flex items-center justify-center p-6 sm:p-8">
        <div className="container w-[95%] bg-white shadow-2xl rounded-3xl p-6 sm:p-12 h-full flex items-center transition-transform hover:scale-[1.01] duration-300 ease-in-out">
          <section className="w-full flex flex-col items-center justify-between gap-8 md:gap-12">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                {data.map((announcement: AnnouncementType) => (
                  <div
                    key={announcement.id}
                    className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-md hover:bg-blue-50 transition-transform duration-300 hover:scale-105"
                  >
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                      {announcement.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatDate(announcement.date)}
                    </p>
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
