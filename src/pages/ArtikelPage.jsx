// src/pages/ArtikelPage.jsx
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

// Placeholder Images
import bannerImage from '../assets/hero-bg.png';
import articleImage from '../assets/rectangle.png';
import logo from '../assets/logo.webp';

// --- STATIC DATA ---
const articlesData = [
  {
    id: 1,
    slug: 'social-impact-assessment-and-community-involvement',
    category: 'Community Development',
    date: 'January 15, 2025',
    title: 'Empowering Communities Through Sustainable Energy',
    excerpt: 'We are committed to drive positive impact and creating shared value consistently in our operations.',
    fullContent: `
      <p>Lorem ipsum dolor sit amet consectetur. Fermentum laoreet pretium sapium obliquam ultrices sit eget nunc eget scelerisque. Ut elementum imperdiet et, et, justo, massa. Tortor ut sed id neque, id, id eu. Sed id nec, est, diam, egestas. Vulputate gravida sed consequat augue tristique ipsum. Massa non purus facilisi at. Ac libero et gravida interdum pulvinar. Sit eget ac arcu tempus id. Vel sed cras odio tempus id. Sit amet et ac, consectetur sem. Orci massa diam non felis id svaätta merus eget euismod scelerisque purus. Nunc, sed id. Vel odio orci a, morbi tristigue ipsum.</p>
      <p>Volutpate gravida sed consequat augue tristique ipsum. Massa non purus facilisi at. Ac libero et gravida interdum pulvinar. Sit eget ac arcu tempus id. Vel sed cras odio tempus id. Sit amet et ac, consectetur sem. Orci massa diam non felis id svaätta merus eget euismod scelerisque purus. Nunc, sed id. Vel odio orci a, morbi tristique ipsum. At ac libero et gravida interdum pulvinar. Sit eget ac arcu tempus id.</p>
      <p>Non turpis sed turpis eget. Duis a crasland vel morbi at. Nulla est sapiam risus aliquet eget egestas. Saculis tempus lorem justo, massa non purus. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    `,
    image: articleImage,
  },
  {
    id: 2,
    slug: 'new-tree-planting-initiative-for-greener-future',
    category: 'Environment',
    date: 'December 22, 2024',
    title: 'New Tree Planting Initiative for a Greener Future',
    excerpt: 'A new initiative focused on environmental sustainability through large-scale tree planting.',
    fullContent: `
      <p>This is the full content for the Tree Planting Initiative. Lorem ipsum dolor sit amet consectetur. Fermentum laoreet pretium sapium obliquam ultrices sit eget nunc eget scelerisque. Ut elementum imperdiet et, et, justo, massa. Tortor ut sed id neque, id, id eu. Sed id nec, est, diam, egestas. Vulputate gravida sed consequat augue tristique ipsum. Massa non purus facilisi at. Ac libero et gravida interdum pulvinar. Sit eget ac arcu tempus id. Vel sed cras odio tempus id. Sit amet et ac, consectetur sem. Orci massa diam non felis id svaätta merus eget euismod scelerisque purus. Nunc, sed id. Vel odio orci a, morbi tristigue ipsum.</p>
      <p>Our efforts aim to combat deforestation and promote biodiversity. We collaborate with local communities to ensure long-term sustainability and positive environmental impact.</p>
    `,
    image: articleImage,
  },
];

// Initial dummy comments
const initialComments = [
  {
    id: 1,
    author: 'Budi Santoso',
    avatar: 'https://via.placeholder.com/48?text=BS',
    content: 'Lorem ipsum is simply dummy text of the printing and typesetting industry.',
    date: 'January 10, 2025',
  },
  {
    id: 2,
    author: 'Siti Aminah',
    avatar: 'https://via.placeholder.com/48?text=SA',
    content: 'Nunc lacinia ex eu feugiat egestas. Maecenas sed nisi massa.',
    date: 'January 12, 2025',
  },
];

// --- SUB-COMPONENTS ---
// Article Header Component
const ArticleHeader = ({ article }) => (
  <header className="container max-w-4xl mx-auto px-4 lg:px-16 pt-16 pb-8 text-center">
    <p className="text-sm font-semibold text-red-600 mb-2" aria-label={`Category: ${article.category}`}>
      {article.category}
    </p>
    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
      {article.title}
    </h1>
    <time dateTime={article.date} className="text-gray-500 block">
      Published on {article.date}
    </time>
  </header>
);

// Article Image Component
const ArticleImage = ({ image, alt }) => (
  <div className="container max-w-5xl mx-auto px-4 lg:px-16 my-8">
    <img
      src={image}
      alt={alt}
      className="w-full h-96 object-cover rounded-lg shadow-lg"
      loading="lazy"
    />
  </div>
);

// Article Content Component
const ArticleContent = ({ content }) => (
  <section className="container max-w-4xl mx-auto px-4 lg:px-16 prose prose-lg max-w-none">
    <div
      className="prose prose-gray"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  </section>
);

// Comment Form Component with state
const CommentForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({ name: '', email: '', comment: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.comment.trim()) {
      alert('Please fill in all fields.');
      return;
    }
    setSubmitting(true);
    onSubmit(formData);  // Pass data to parent for handling
    setFormData({ name: '', email: '', comment: '' });  // Reset form
    setSubmitting(false);  // Reset submitting state
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-left">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1" aria-describedby="name-desc">
          Name *
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your name"
          required
          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1" aria-describedby="email-desc">
          Email *
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your.email@example.com"
          required
          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
        />
      </div>
      <div className="md:col-span-2">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1" aria-describedby="comment-desc">
          Comment *
        </label>
        <textarea
          id="comment"
          name="comment"
          value={formData.comment}
          onChange={handleChange}
          placeholder="Share your thoughts..."
          rows="5"
          required
          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-vertical"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="md:col-span-2 bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
      >
        {submitting ? 'Posting...' : 'Post Comment'}
      </button>
    </form>
  );
};

// Comment Item Component
const CommentItem = ({ comment }) => (
  <article className="flex items-start gap-4 text-left">
    <img
      src={comment.avatar}
      alt={`Avatar of ${comment.author}`}
      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
      loading="lazy"
    />
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1">
        <cite className="font-bold text-gray-900 not-italic">{comment.author}</cite>
        <time dateTime={comment.date} className="text-sm text-gray-500">
          {comment.date}
        </time>
      </div>
      <p className="text-gray-600 leading-relaxed">{comment.content}</p>
    </div>
  </article>
);

// Comments Section Component
const CommentsSection = ({ comments }) => (
  <section aria-labelledby="comments-heading" className="text-left">
    <h3 id="comments-heading" className="text-2xl font-bold mb-6">
      Comments ({comments.length})
    </h3>
    <div className="space-y-6">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  </section>
);

// Not Found Component
const NotFound = () => (
  <div className="container mx-auto px-4 lg:px-16 py-16 text-center">
    <h1 className="text-4xl font-bold text-gray-900 mb-4">Artikel Tidak Ditemukan</h1>
    <p className="text-gray-600 mb-8">Maaf, artikel yang Anda cari tidak tersedia.</p>
    <Link
      to="/berita-tjsl"
      className="inline-block bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition-colors"
    >
      Kembali ke Daftar Berita
    </Link>
  </div>
);

// --- MAIN COMPONENT ---
const ArtikelPage = () => {
  const { slug } = useParams();
  const [comments, setComments] = useState(initialComments);

  const article = articlesData.find((a) => a.slug === slug);

  if (!article) {
    return <NotFound />;
  }

  const handleCommentSubmit = (formData) => {
    // Simulate adding a new comment
    const newComment = {
      id: Date.now(),
      author: formData.name,
      avatar: 'https://via.placeholder.com/48?text=' + formData.name.charAt(0).toUpperCase(),
      content: formData.comment,
      date: new Date().toLocaleDateString(),
    };
    setComments([newComment, ...comments]);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Optional Banner */}
      <section className="relative h-64 w-full overflow-hidden mb-8">
        <img
          src={bannerImage}
          alt="TJSL Banner - Article Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <img
            src={logo}
            alt="TJSL Logo"
            className="h-8 absolute top-4 right-4 lg:right-16 z-10"
          />
        </div>
      </section>

      {/* Article Content */}
      <ArticleHeader article={article} />
      <ArticleImage image={article.image} alt={article.title} />
      <ArticleContent content={article.fullContent} />

      {/* Comments Section - Aligned to left */}
      <section className="bg-gray-50 py-16" aria-labelledby="comments-section-heading">
        <div className="container max-w-4xl px-4 lg:px-16">  {/* Removed mx-auto to align left */}
          <h2 id="comments-section-heading" className="text-3xl font-bold mb-8 text-gray-900 text-left">
            Diskusi & Komentar
          </h2>
          <CommentForm onSubmit={handleCommentSubmit} />
          <CommentsSection comments={comments} />
        </div>
      </section>
    </div>
  );
};

export default ArtikelPage;