// src/pages/BeritaTJSLPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

// Placeholder Images
import bannerImage from '../assets/hero-bg.png';
import articleImage from '../assets/rectangle.png';
import logo from '../assets/logo.webp';

// --- STATIC DATA ---
// Articles data for main content
const articlesData = [
  {
    id: 1,
    slug: 'social-impact-assessment-and-community-involvement',
    category: 'Community Development',
    date: 'January 15, 2025',
    title: 'Social Impact Assessment and Community Involvement',
    description: 'We are committed to drive positive impact and creating shared value consistently in our operations. Our social impact initiatives ensure that our projects align with community needs and values.',
    image: articleImage,
  },
  {
    id: 2,
    slug: 'new-tree-planting-initiative-for-greener-future',
    category: 'Environment',
    date: 'December 22, 2024',
    title: 'New Tree Planting Initiative for a Greener Future',
    description: 'A new initiative focused on environmental sustainability through large-scale tree planting to combat deforestation and promote biodiversity in the region.',
    image: articleImage,
  },
];

// Recent posts (first 4 articles)
const recentPosts = articlesData.slice(0, 4);

// Testimonials data
const testimonials = [
  {
    id: 1,
    name: 'Budi Santoso',
    text: 'Integer diam nulla, rhoncus sed lorem ac, feugiat laoreet sem. Maecenas sed nisi massa. Praesent eget auctor eros.',
  },
  {
    id: 2,
    name: 'Siti Aminah',
    text: 'Aliquam vel dolor dictum, tincidunt magna et, porta velit. Integer diam nulla, rhoncus sed lorem ac, feugiat laoreet sem.',
  },
  {
    id: 3,
    name: 'Joko Susilo',
    text: 'Praesent eget auctor eros. Nunc lacinia ex eu feugiat egestas. Maecenas sed nisi massa. Integer diam nulla, rhoncus sed lorem ac.',
  },
];

// Event calendar data
const events = [
  {
    id: 1,
    day: '15',
    month: 'Dec',
    title: 'Discovering the new solar panel',
    description: 'December 15, 2024',
  },
  {
    id: 2,
    day: '05',
    month: 'Jan',
    title: 'TJSL Scholarship Deadline',
    description: '2024 academic year scholarships',
  },
  {
    id: 3,
    day: '22',
    month: 'Mar',
    title: 'Tree Planting Day',
    description: 'Join our annual environmental initiative',
  },
];

// --- SUB-COMPONENTS ---
// Article Card Component
const ArticleCard = ({ article }) => (
  <article className="group">
    <img
      src={article.image}
      alt={article.title}
      className="w-full h-64 object-cover rounded-lg mb-6 shadow-md"
      loading="lazy"
    />
    <p className="text-sm mb-2 flex items-center justify-between">
      <span className="font-semibold text-red-600" aria-label={`Category: ${article.category}`}>
        {article.category}
      </span>
      <time dateTime={article.date} className="text-gray-400">
        {article.date}
      </time>
    </p>
    <h2 className="text-3xl font-bold text-gray-800 mb-3 leading-tight">
      {article.title}
    </h2>
    <p className="text-gray-500 mb-4 leading-relaxed">{article.description}</p>
    <Link
      to={`/artikel/${article.slug}`}
      className="font-semibold text-red-600 hover:text-red-700 flex items-center transition-colors"
      aria-label={`Read more about ${article.title}`}
    >
      Read More
      <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
    </Link>
  </article>
);

// Recent Post Item Component
const RecentPostItem = ({ post }) => (
  <div className="flex items-start space-x-4">
    <img
      src={post.image}
      alt={post.title}
      className="w-16 h-16 object-cover rounded-md flex-shrink-0"
      loading="lazy"
    />
    <div className="flex-1 min-w-0">
      <Link
        to={`/artikel/${post.slug}`}
        className="font-semibold text-sm leading-tight text-gray-800 hover:text-red-600 transition-colors block"
        title={post.title}
      >
        {post.title}
      </Link>
      <p className="text-xs text-gray-400 mt-1">
        <time dateTime={post.date}>{post.date}</time>
      </p>
    </div>
  </div>
);

// Event Item Component
const EventItem = ({ event }) => (
  <li className="flex items-start space-x-4">
    <strong className="text-red-600 text-3xl font-black flex-shrink-0">
      {event.day}
      <span className="block text-sm font-normal text-gray-500">{event.month}</span>
    </strong>
    <div className="flex-1 min-w-0">
      <h4 className="font-bold text-gray-800 mb-1">{event.title}</h4>
      <p className="text-xs text-gray-400">{event.description}</p>
    </div>
  </li>
);

// Testimonial Card Component
const TestimonialCard = ({ testimonial }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
    <blockquote className="text-gray-600 italic mb-4">
      "{testimonial.text}"
    </blockquote>
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" aria-hidden="true"></div>
      <cite className="font-bold text-gray-800 not-italic">- {testimonial.name}</cite>
    </div>
  </div>
);

// Pagination Component (Placeholder - can be made functional with props)
const Pagination = () => (
  <nav className="flex justify-center items-center space-x-2 pt-8" aria-label="Pagination">
    <span className="px-4 py-2 bg-red-600 text-white rounded-md font-bold">1</span>
    <Link to="#" className="px-4 py-2 hover:bg-gray-100 text-gray-700 rounded-md transition-colors">
      2
    </Link>
    <Link to="#" className="px-4 py-2 hover:bg-gray-100 text-gray-700 rounded-md transition-colors">
      3
    </Link>
    <span className="px-2 text-gray-400">...</span>
    <Link to="#" className="px-4 py-2 hover:bg-gray-100 text-gray-700 rounded-md transition-colors">
      8
    </Link>
    <Link
      to="#"
      className="px-3 py-2 hover:bg-gray-100 text-gray-700 rounded-md transition-colors"
      aria-label="Next page"
    >
      ›
    </Link>
  </nav>
);

// Search Input Component
const SearchInput = () => (
  <div className="relative">
    <input
      type="search"
      placeholder="Search Articles..."
      className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
      aria-label="Search articles"
    />
    <svg
      className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  </div>
);

// --- MAIN COMPONENT ---
const BeritaTJSLPage = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Banner Section */}
      <section className="relative h-72 md:h-80 w-full overflow-hidden">
        <img
          src={bannerImage}
          alt="TJSL Banner - Highlighting community and environmental initiatives"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="container mx-auto px-4 lg:px-16 text-center">
            <h1 className="text-white text-4xl md:text-6xl font-bold">
              Berita TJSL
            </h1>
          </div>
        </div>
        <img
          src={logo}
          alt="TJSL Logo"
          className="h-10 absolute top-4 right-4 lg:right-16 z-10"
        />
      </section>

      {/* Main Content Section */}
      <section className="container mx-auto px-4 lg:px-16 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Articles Column */}
          <main className="lg:col-span-2 space-y-12" role="main">
            {articlesData.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
            <Pagination />
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-10" role="complementary">
            <SearchInput />
            
            {/* Recent Posts */}
            <section aria-labelledby="recent-heading">
              <h3 id="recent-heading" className="font-bold text-xl mb-6">
                Recent
              </h3>
              <div className="space-y-5">
                {recentPosts.map((post) => (
                  <RecentPostItem key={post.id} post={post} />
                ))}
              </div>
            </section>

            {/* Event Calendar */}
            <section aria-labelledby="events-heading">
              <h3 id="events-heading" className="font-bold text-xl mb-6">
                Event Calendar / TJSL Activities
              </h3>
              <ul className="space-y-6" role="list">
                {events.map((event) => (
                  <EventItem key={event.id} event={event} />
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-50 py-20" aria-labelledby="testimonials-heading">
        <div className="container mx-auto px-4 lg:px-16">
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

export default BeritaTJSLPage;