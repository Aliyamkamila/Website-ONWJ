import React from 'react';
import { Link } from 'react-router-dom';
import bannerImage from '../assets/hero-bg.png';
import programImage from '../assets/rectangle.png'; 
import logo from '../assets/logo.webp';
import { FaRegCalendarAlt, FaChartBar, FaUsers } from 'react-icons/fa';

const allProgramsData = [
  { id: 1, slug: 'social-impact-assessment-and-community-involvement', category: 'Community Development', title: 'Social Impact Assessment and Community Involvement', date: '05 January 2025', image: programImage, description: 'We are committed to drive positive impact and creating shared value consistently...' },
  { id: 2, slug: 'energi-berdikari-village', category: 'Environment', title: 'Energi Berdikari Village', date: '12 February 2025', image: programImage, description: 'A new initiative focused on environmental sustainability...' },
  { id: 3, slug: 'community-development-program', category: 'Community', title: 'Community Development Program', date: '18 March 2025', image: programImage, description: 'Details about our community development programs...' },
  { id: 4, slug: 'program-pendidikan-lokal', category: 'Pendidikan', title: 'Program Pendidikan Lokal', date: '22 April 2025', image: programImage, description: 'Supporting local education facilities and scholarships...' },
  { id: 5, slug: 'konservasi-lingkungan-pesisir', category: 'Environment', title: 'Konservasi Lingkungan Pesisir', date: '30 May 2025', image: programImage, description: 'Protecting marine ecosystems and coastal areas...' },
  { id: 6, slug: 'bantuan-kesehatan-masyarakat', category: 'Kesehatan', title: 'Bantuan Kesehatan Masyarakat', date: '15 June 2025', image: programImage, description: 'Providing health services and facilities for communities...' },
];

const recentPrograms = allProgramsData.slice(0, 3);
const testimonials = [
    { id: 1, name: 'Budi Santoso', text: 'Programnya sangat membantu desa kami, terima kasih!' },
    { id: 2, name: 'Siti Aminah', text: 'Dukungan pendidikan ini sangat berarti bagi anak-anak kami.' },
    { id: 3, name: 'Joko Susilo', text: 'Semoga program seperti ini bisa terus berlanjut dan berkembang.' },
];
const events = [
    { id: 1, day: '15', month: 'Dec', title: 'Evaluasi Program Tahunan 2025', description: 'December 15, 2025' },
    { id: 2, day: '05', month: 'Jan', title: 'Peluncuran Program Energi 2026', description: 'January 05, 2026' },
];

const HorizontalProgramCard = ({ program }) => (
  <article className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col md:flex-row">
    <div className="md:w-2/5 h-48 md:h-auto">
      <Link to={`/artikel/${program.slug}`}>
        <img src={program.image} alt={program.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
      </Link>
    </div>
    <div className="md:w-3/5 p-6 flex flex-col justify-between">
      <div>
        <p className="text-sm mb-2">
          <span className="font-semibold text-blue-600">{program.category}</span>
          <time dateTime={program.date} className="text-gray-400 ml-3">{program.date}</time>
        </p>
        <h2 className="text-xl font-bold text-gray-800 mb-2 leading-tight">
          <Link to={`/artikel/${program.slug}`} className="hover:text-blue-600 transition-colors">
            {program.title}
          </Link>
        </h2>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{program.description}</p>
      </div>
      <Link to={`/artikel/${program.slug}`} className="font-semibold text-blue-600 flex items-center group self-start mt-auto" aria-label={`Read more about ${program.title}`}>
        Read More <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
      </Link>
    </div>
  </article>
);


const SidebarCard = ({ title, children, ariaId }) => ( <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100" aria-labelledby={ariaId}> {title && <h3 id={ariaId} className="font-bold text-xl mb-6">{title}</h3>} {children} </section> );
const RecentProgramItem = ({ program }) => ( <div className="flex items-start space-x-4"> <img src={program.image} alt={program.title} className="w-16 h-16 object-cover rounded-md flex-shrink-0" loading="lazy" /> <div className="flex-1 min-w-0"> <Link to={`/artikel/${program.slug}`} className="font-semibold text-sm leading-tight text-gray-800 hover:text-blue-600 transition-colors block" title={program.title}> {program.title} </Link> <p className="text-xs text-gray-400 mt-1"><time dateTime={program.date}>{program.date}</time></p> </div> </div> );
const QuickStats = () => ( <div className="space-y-4"> <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"> <div className="bg-red-100 p-2 rounded-md"><FaChartBar className="w-6 h-6 text-red-600"/></div> <div> <p className="text-2xl font-bold text-gray-800">{allProgramsData.length}+</p> <p className="text-sm text-gray-500">Program Aktif</p> </div> </div> <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"> <div className="bg-blue-100 p-2 rounded-md"><FaUsers className="w-6 h-6 text-blue-600"/></div> <div> <p className="text-2xl font-bold text-gray-800">10,000</p> <p className="text-sm text-gray-500">Penerima Manfaat</p> </div> </div> </div> );
const EventItem = ({ event }) => ( <li className="flex items-start space-x-4"> <strong className="text-blue-600 text-3xl font-black flex-shrink-0 w-12 text-center">{event.day}<span className="block text-sm font-normal text-gray-500">{event.month}</span></strong> <div className="flex-1 min-w-0"> <h4 className="font-bold text-gray-800 mb-1">{event.title}</h4> <p className="text-xs text-gray-400">{event.description}</p> </div> </li> );
const SearchInput = () => ( <div className="relative"> <input type="search" placeholder="Search Programs..." className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Search programs" /> <svg className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> </div> );
const Pagination = () => ( <nav className="flex justify-center items-center space-x-2 pt-8" aria-label="Pagination"> <span className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md font-bold">1</span> <Link to="#" className="px-4 py-2 hover:bg-gray-100 text-gray-700 rounded-md transition-colors">2</Link> <Link to="#" className="px-3 py-2 hover:bg-gray-100 text-gray-700 rounded-md transition-colors" aria-label="Next page">›</Link> </nav> );
const TestimonialCard = ({ testimonial }) => ( <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"> <blockquote className="text-gray-600 italic mb-4">"{testimonial.text}"</blockquote> <div className="flex items-center gap-3"> <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" aria-hidden="true"></div> <cite className="font-bold text-gray-800 not-italic">- {testimonial.name}</cite> </div> </div> );

const AllProgramsPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
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
      <div className="container mx-auto px-8 lg:px-16 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <main className="lg:col-span-2 space-y-8">
            {allProgramsData.map((prog) => (
              <HorizontalProgramCard key={prog.id} program={prog} />
            ))}
            <Pagination />
          </main>
          <aside className="space-y-8">
            <SidebarCard ariaId="search-programs">
                <SearchInput />
            </SidebarCard>
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
      <section className="bg-white py-20" aria-labelledby="testimonials-heading">
        <div className="container mx-auto px-8 lg:px-16">
          <h2 id="testimonials-heading" className="text-3xl font-bold text-center mb-12 text-gray-900">
            Voices From The Community
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AllProgramsPage;