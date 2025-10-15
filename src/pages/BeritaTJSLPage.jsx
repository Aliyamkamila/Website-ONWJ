// src/pages/BeritaTJSLPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

// Placeholder Images
import bannerImage from '../assets/hero-bg.png';
import articleImage from '../assets/rectangle.png';
import logo from '../assets/logo.webp';

// --- DATA DUMMY ---
const articlesData = [
    { id: 1, slug: 'social-impact-assessment-and-community-involvement', category: 'Community Development', date: 'January 15, 2025', title: 'Social Impact Assessment and Community Involvement', description: 'We are committed to drive positive impact and creating shared value consistently in our operations...', image: articleImage },
    { id: 2, slug: 'new-tree-planting-initiative-for-greener-future', category: 'Environment', date: 'December 22, 2024', title: 'New Tree Planting Initiative for a Greener Future', description: 'A new initiative focused on environmental sustainability through large-scale tree planting...', image: articleImage },
    { id: 3, slug: 'artikel-ketiga-yang-baru', category: 'Environment', date: 'December 22, 2024', title: 'New Tree Planting Initiative for a Greener Future', description: 'A new initiative focused on environmental sustainability through large-scale tree planting...', image: articleImage },
    { id: 4, slug: 'artikel-keempat-yang-baru', category: 'Community Development', date: 'January 15, 2025', title: 'Social Impact Assessment and Community Involvement', description: 'We are committed to drive positive impact and creating shared value consistently in our operations...', image: articleImage },
];

const recentPosts = articlesData.slice(0, 4);

const testimonials = [
    { id: 1, name: 'Budi Santoso', text: 'Integer diam nulla, rhoncus sed lorem ac, feugiat laoreet sem. Maecenas sed nisi massa. Praesent eget auctor eros.' },
    { id: 2, name: 'Siti Aminah', text: 'Aliquam vel dolor dictum, tincidunt magna et, porta velit. Integer diam nulla, rhoncus sed lorem ac, feugiat laoreet sem.' },
    { id: 3, name: 'Joko Susilo', text: 'Praesent eget auctor eros. Nunc lacinia ex eu feugiat egestas. Maecenas sed nisi massa. Integer diam nulla, rhoncus sed lorem ac.' },
];

const events = [
    { id: 1, day: '15', month: 'Dec', title: 'Discovering the new solar panel', description: 'December 15, 2024' },
    { id: 2, day: '05', month: 'Jan', title: 'TJSL Scholarship Deadline', description: '2024 academic year scholarships' },
    { id: 3, day: '22', month: 'Mar', title: 'Tree Planting Day', description: 'Join our annual environmental initiative' },
];

// --- SUB-KOMPONEN ---

const ArticleCard = ({ article }) => (
    <article className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-5">
            <div className="md:col-span-2 h-48 md:h-full">
                <Link to={`/artikel/${article.slug}`}>
                    <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                </Link>
            </div>
            <div className="md:col-span-3 p-6 flex flex-col">
                <p className="text-sm mb-2">
                    <span className="font-semibold text-blue-600">{article.category}</span>
                    <time dateTime={article.date} className="text-gray-400 ml-3">{article.date}</time>
                </p>
                <h2 className="text-xl font-bold text-gray-800 mb-2 leading-tight">
                    <Link to={`/artikel/${article.slug}`} className="hover:text-blue-600 transition-colors">{article.title}</Link>
                </h2>
                <p className="text-gray-600 text-sm mb-4 flex-grow">{article.description}</p>
                <Link to={`/artikel/${article.slug}`} className="font-semibold text-blue-600 flex items-center group self-start mt-auto">
                    Read More <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                </Link>
            </div>
        </div>
    </article>
);

const SidebarCard = ({ title, children, ariaId }) => (
    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100" aria-labelledby={ariaId}>
        {title && <h3 id={ariaId} className="font-bold text-xl mb-6">{title}</h3>}
        {children}
    </section>
);

const RecentPostItem = ({ post }) => (
  <div className="flex items-start space-x-4">
    <img src={post.image} alt={post.title} className="w-16 h-16 object-cover rounded-md flex-shrink-0" loading="lazy" />
    <div className="flex-1 min-w-0">
      <Link to={`/artikel/${post.slug}`} className="font-semibold text-sm leading-tight text-gray-800 hover:text-blue-600 transition-colors block" title={post.title}>
        {post.title}
      </Link>
      <p className="text-xs text-gray-400 mt-1"><time dateTime={post.date}>{post.date}</time></p>
    </div>
  </div>
);

const QuickStats = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="bg-red-100 p-2 rounded-md"><svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg></div>
        <div>
          <p className="text-2xl font-bold text-gray-800">50+</p>
          <p className="text-sm text-gray-500">Projects Completed</p>
        </div>
      </div>
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="bg-blue-100 p-2 rounded-md"><svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg></div>
        <div>
          <p className="text-2xl font-bold text-gray-800">10,000</p>
          <p className="text-sm text-gray-500">People Benefited</p>
        </div>
      </div>
    </div>
);

const EventItem = ({ event }) => (
    <li className="flex items-start space-x-4">
        <strong className="text-red-600 text-3xl font-black flex-shrink-0 w-12 text-center">{event.day}<span className="block text-sm font-normal text-gray-500">{event.month}</span></strong>
        <div className="flex-1 min-w-0">
        <h4 className="font-bold text-gray-800 mb-1">{event.title}</h4>
        <p className="text-xs text-gray-400">{event.description}</p>
        </div>
    </li>
);

const TestimonialCard = ({ testimonial }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <blockquote className="text-gray-600 italic mb-4">"{testimonial.text}"</blockquote>
        <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" aria-hidden="true"></div>
        <cite className="font-bold text-gray-800 not-italic">- {testimonial.name}</cite>
        </div>
    </div>
);

const Pagination = () => (
  <nav className="flex justify-center items-center space-x-2 pt-8" aria-label="Pagination">
    <span className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md font-bold">1</span>
    <Link to="#" className="px-4 py-2 hover:bg-gray-100 text-gray-700 rounded-md transition-colors">2</Link>
    <Link to="#" className="px-4 py-2 hover:bg-gray-100 text-gray-700 rounded-md transition-colors">3</Link>
    <span className="px-2 text-gray-400">...</span>
    <Link to="#" className="px-4 py-2 hover:bg-gray-100 text-gray-700 rounded-md transition-colors">8</Link>
    <Link to="#" className="px-3 py-2 hover:bg-gray-100 text-gray-700 rounded-md transition-colors" aria-label="Next page">›</Link>
  </nav>
);

const SearchInput = () => (
  <div className="relative">
    <input type="search" placeholder="Search Articles..." className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Search articles" />
    <svg className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
  </div>
);

// --- MAIN COMPONENT ---
const BeritaTJSLPage = () => {
  return (
    <div className="bg-gray-50">
      {/* Banner */}
      <section className="relative h-72 md:h-80 w-full">
        <img src={bannerImage} alt="Banner TJSL" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="container mx-auto px-8 lg:px-16 h-full flex items-center justify-start">
          <h1 className="text-white text-5xl font-bold relative inline-block pb-4">
            Berita TJSL
            <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-500"></span>
          </h1>
        </div>
        <img src={logo} alt="Logo" className="h-10 absolute top-8 right-8 lg:right-16" />
      </section>

      <div className="container mx-auto px-8 lg:px-16 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <main className="lg:col-span-2 space-y-8">
            {articlesData.map((article) => <ArticleCard key={article.id} article={article} />)}
            <Pagination />
          </main>

          {/* Sidebar */}
          <aside className="space-y-8">
            <SidebarCard ariaId="search-articles">
                <SearchInput />
            </SidebarCard>
            <SidebarCard title="Recent" ariaId="recent-posts">
                <div className="space-y-5">
                    {recentPosts.map((post) => <RecentPostItem key={post.id} post={post} />)}
                </div>
            </SidebarCard>
            <SidebarCard ariaId="quick-stats">
                <QuickStats />
            </SidebarCard>
            <SidebarCard title="Event Calendar / TJSL Activities" ariaId="event-calendar">
                <ul className="space-y-6" role="list">
                    {events.map((event) => <EventItem key={event.id} event={event} />)}
                </ul>
            </SidebarCard>
          </aside>
        </div>
      </div>

      {/* Voices from the community */}
      <section className="bg-white py-20" aria-labelledby="testimonials-heading">
        <div className="container mx-auto px-8 lg:px-16">
          <h2 id="testimonials-heading" className="text-3xl font-bold text-center mb-12 text-gray-900">Voices From The Community</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => <TestimonialCard key={testimonial.id} testimonial={testimonial} />)}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BeritaTJSLPage;