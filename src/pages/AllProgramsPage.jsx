// src/pages/AllProgramsPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import ProgramCard from '../components/ProgramCard'; // Gunakan komponen kartu program

// Placeholder Images & Icons
import bannerImage from '../assets/hero-bg.png';
import programImage from '../assets/rectangle.png'; // Gambar default untuk program
import logo from '../assets/logo.webp';
// Impor ikon jika diperlukan (contoh dari BeritaTJSLPage)
import { FaRegCalendarAlt, FaChartBar, FaUsers } from 'react-icons/fa'; // Contoh ikon

// --- DATA DUMMY (Lebih banyak program) ---
const allProgramsData = [
  { id: 1, slug: 'social-impact-assessment-and-community-involvement', title: 'Social Impact Assessment and Community Involvement', date: '05 January 2025', image: programImage },
  { id: 2, slug: 'energi-berdikari-village', title: 'Energi Berdikari Village', date: '12 February 2025', image: programImage },
  { id: 3, slug: 'community-development-program', title: 'Community Development Program', date: '18 March 2025', image: programImage },
  { id: 4, slug: 'program-pendidikan-lokal', title: 'Program Pendidikan Lokal', date: '22 April 2025', image: programImage },
  { id: 5, slug: 'konservasi-lingkungan-pesisir', title: 'Konservasi Lingkungan Pesisir', date: '30 May 2025', image: programImage },
  { id: 6, slug: 'bantuan-kesehatan-masyarakat', title: 'Bantuan Kesehatan Masyarakat', date: '15 June 2025', image: programImage },
];

// Data dummy untuk sidebar (sesuaikan isinya jika perlu)
const recentPrograms = allProgramsData.slice(0, 3); // Ambil 3 program terbaru
const events = [
    { id: 1, day: '15', month: 'Dec', title: 'Evaluasi Program Tahunan', description: 'December 15, 2025' },
    { id: 2, day: '05', month: 'Jan', title: 'Peluncuran Program Baru', description: 'January 05, 2026' },
];

// --- SUB-KOMPONEN SIDEBAR (Mirip BeritaTJSLPage) ---
const SidebarCard = ({ title, children, ariaId }) => (
    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100" aria-labelledby={ariaId}>
        {title && <h3 id={ariaId} className="font-bold text-xl mb-6">{title}</h3>}
        {children}
    </section>
);

const RecentProgramItem = ({ program }) => (
  <div className="flex items-start space-x-4">
    <img src={program.image} alt={program.title} className="w-16 h-16 object-cover rounded-md flex-shrink-0" loading="lazy" />
    <div className="flex-1 min-w-0">
      <Link to={`/artikel/${program.slug}`} className="font-semibold text-sm leading-tight text-gray-800 hover:text-blue-600 transition-colors block" title={program.title}>
        {program.title}
      </Link>
      <p className="text-xs text-gray-400 mt-1"><time dateTime={program.date}>{program.date}</time></p>
    </div>
  </div>
);

const QuickStats = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="bg-red-100 p-2 rounded-md"><FaChartBar className="w-6 h-6 text-red-600"/></div>
        <div>
          <p className="text-2xl font-bold text-gray-800">{allProgramsData.length}+</p>
          <p className="text-sm text-gray-500">Total Program Aktif</p>
        </div>
      </div>
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="bg-blue-100 p-2 rounded-md"><FaUsers className="w-6 h-6 text-blue-600"/></div>
        <div>
          <p className="text-2xl font-bold text-gray-800">10,000</p>
          <p className="text-sm text-gray-500">Penerima Manfaat</p>
        </div>
      </div>
    </div>
);

const EventItem = ({ event }) => (
    <li className="flex items-start space-x-4">
        <strong className="text-blue-600 text-3xl font-black flex-shrink-0 w-12 text-center">{event.day}<span className="block text-sm font-normal text-gray-500">{event.month}</span></strong>
        <div className="flex-1 min-w-0">
        <h4 className="font-bold text-gray-800 mb-1">{event.title}</h4>
        <p className="text-xs text-gray-400">{event.description}</p>
        </div>
    </li>
);

const Pagination = () => ( // Placeholder
  <nav className="flex justify-center items-center space-x-2 pt-12" aria-label="Pagination">
    <span className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md font-bold">1</span>
    <Link to="#" className="px-4 py-2 hover:bg-gray-100 text-gray-700 rounded-md transition-colors">2</Link>
    <Link to="#" className="px-3 py-2 hover:bg-gray-100 text-gray-700 rounded-md transition-colors" aria-label="Next page">›</Link>
  </nav>
);

// --- MAIN COMPONENT ---
const AllProgramsPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Banner */}
      <section className="relative h-72 md:h-80 w-full">
        <img src={bannerImage} alt="Banner Program Berkelanjutan" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="container mx-auto px-8 lg:px-16 h-full flex items-center justify-start">
          <h1 className="text-white text-5xl font-bold relative inline-block pb-4">
            Program Berkelanjutan
            <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-500"></span>
          </h1>
        </div>
        <img src={logo} alt="Logo" className="h-10 absolute top-8 right-8 lg:right-16" />
      </section>

      {/* Main Content with Sidebar */}
      <div className="container mx-auto px-8 lg:px-16 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Program Grid (Kolom Kiri) */}
          <main className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {allProgramsData.map((prog) => (
                <ProgramCard key={prog.id} program={prog} />
              ))}
            </div>
            <Pagination />
          </main>

          {/* Sidebar (Kolom Kanan) */}
          <aside className="space-y-8">
            <SidebarCard title="Recently Added" ariaId="recent-programs">
                <div className="space-y-5">
                    {recentPrograms.map((prog) => <RecentProgramItem key={prog.id} program={prog} />)}
                </div>
            </SidebarCard>
            <SidebarCard ariaId="quick-stats-programs">
                <QuickStats />
            </SidebarCard>
            <SidebarCard title="Upcoming Events" ariaId="program-events">
                <ul className="space-y-6" role="list">
                    {events.map((event) => <EventItem key={event.id} event={event} />)}
                </ul>
            </SidebarCard>
          </aside>
        </div>
      </div>
       {/* Section Voices From The Community bisa ditambahkan di sini jika perlu */}
       {/* <section className="bg-white py-20" aria-labelledby="testimonials-heading">...</section> */}
    </div>
  );
};

export default AllProgramsPage;