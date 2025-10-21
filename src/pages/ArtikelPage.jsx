// src/pages/ArtikelPage.jsx
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

// Ikon
import { FaShareAlt, FaHome } from 'react-icons/fa'; // Pastikan react-icons sudah terinstall

// Placeholder Images
import bannerImage from '../assets/hero-bg.png'; // Mungkin tidak perlu banner besar lagi
import articleImage from '../assets/rectangle.png';
import logo from '../assets/logo.webp';

// --- DATA ARTIKEL LENGKAP (Pastikan sinkron) ---
const articlesData = [
  { id: 1, slug: 'social-impact-assessment-and-community-involvement', category: 'Community Development', date: 'January 15, 2025', title: 'Empowering Communities Through Sustainable Energy', fullContent: `<p>Lorem ipsuvvxfbrjhbgfvrjhgfjhbbcdskjbfjksfkjhkjvbjsvbjshbhbsvbsvbdhhhhhhhhhhhhhh dolor sit amet consectetur...</p><p>Volutpate gravida sed consequat augue...</p><p>Non turpis sed turpis eget...</p>`, image: articleImage },
  { id: 2, slug: 'new-tree-planting-initiative-for-greener-future', category: 'Environment', date: 'December 22, 2024', title: 'New Tree Planting Initiative for a Greener Future', fullContent: `<p>This is the full content for the Tree Planting Initiative...</p><p>Our efforts aim to combat deforestation...</p>`, image: articleImage },
  { id: 3, slug: 'artikel-ketiga-yang-baru', category: 'Technology', date: 'November 30, 2024', title: 'Innovations in Renewable Energy Technology', fullContent: `<p>Konten lengkap untuk artikel ketiga...</p>`, image: articleImage },
  { id: 4, slug: 'artikel-keempat-yang-baru', category: 'Corporate', date: 'November 15, 2024', title: 'Our Commitment to Corporate Governance', fullContent: `<p>Konten lengkap untuk artikel keempat...</p>`, image: articleImage },
];

const initialComments = [
  { id: 1, author: 'Budi Santoso', avatar: 'https://via.placeholder.com/48?text=BS', content: 'Artikel yang sangat informatif!', date: 'Jan 10, 2025' },
  { id: 2, author: 'Siti Aminah', avatar: 'https://via.placeholder.com/48?text=SA', content: 'Terima kasih atas wawasannya.', date: 'Jan 12, 2025' },
];

// --- SUB-KOMPONEN ---

// Breadcrumbs Component
const Breadcrumbs = ({ category, title }) => (
  <nav aria-label="breadcrumb" className="mb-8 text-sm text-gray-500">
    <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
      <li className="inline-flex items-center">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <FaHome className="mr-2" /> Home
        </Link>
      </li>
      <li><div className="flex items-center"><span className="mx-1">/</span><Link to="/berita-tjsl" className="ms-1 text-blue-600 hover:text-blue-800">Berita TJSL</Link></div></li>
      <li aria-current="page"><div className="flex items-center"><span className="mx-1">/</span><span className="ms-1 text-gray-400">{title}</span></div></li>
    </ol>
  </nav>
);

const ArticleHeader = ({ article }) => (
  <header className="mb-12">
    <p className="font-semibold text-blue-600 mb-2 uppercase tracking-wide">{article.category}</p>
    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">{article.title}</h1>
    <time dateTime={article.date} className="text-gray-500 block">Published on {article.date}</time>
  </header>
);

const ArticleImage = ({ image, alt }) => (
  <div className="my-10">
    <img src={image} alt={alt} className="w-full h-auto max-h-[550px] object-cover rounded-lg shadow-lg" loading="lazy" />
  </div>
);

// Menggunakan Tailwind Typography Plugin (`prose`)
const ArticleContent = ({ content }) => (
  <section className="prose prose-lg max-w-none prose-p:text-gray-600 prose-headings:text-gray-900 prose-a:text-blue-600 hover:prose-a:text-blue-800">
    <div dangerouslySetInnerHTML={{ __html: content }} />
  </section>
);

const CommentForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({ name: '', email: '', comment: '' });
  const handleSubmit = (e) => { e.preventDefault(); if (!formData.name || !formData.email || !formData.comment.trim()) { alert('Please fill all fields.'); return; } onSubmit(formData); setFormData({ name: '', email: '', comment: '' }); };
  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12" aria-labelledby="comment-form-heading">
      <h3 id="comment-form-heading" className="text-2xl font-bold md:col-span-2">Leave a Comment</h3>
      <div><label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name *</label><input id="name" name="name" type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Your name" required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
      <div><label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label><input id="email" name="email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="your.email@example.com" required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
      <div className="md:col-span-2"><label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">Comment *</label><textarea id="comment" name="comment" value={formData.comment} onChange={(e) => setFormData({...formData, comment: e.target.value})} placeholder="Share your thoughts..." rows="5" required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
      <button type="submit" className="md:col-start-1 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition w-full md:w-auto">Post Comment</button>
    </form>
  );
};

const CommentItem = ({ comment }) => (<article className="flex items-start gap-4 py-6 border-b border-gray-200 last:border-b-0"><img src={comment.avatar} alt={`Avatar of ${comment.author}`} className="w-12 h-12 rounded-full" loading="lazy" /><div className="flex-1"><div className="flex items-baseline gap-2 mb-1"><cite className="font-bold text-gray-900 not-italic">{comment.author}</cite><time dateTime={comment.date} className="text-sm text-gray-500">{comment.date}</time></div><p className="text-gray-600">{comment.content}</p></div></article>);
const CommentsSection = ({ comments }) => (<section aria-labelledby="comments-heading" className="mt-16"><h3 id="comments-heading" className="text-2xl font-bold mb-6">Comments ({comments.length})</h3><div className="space-y-0">{comments.map((comment) => (<CommentItem key={comment.id} comment={comment}/>))}</div></section>);
const NotFound = () => (<div className="container mx-auto px-4 lg:px-16 py-16 text-center"><h1 className="text-4xl font-bold mb-4">Artikel Tidak Ditemukan</h1><p className="text-gray-600 mb-8">Maaf, artikel yang Anda cari tidak tersedia.</p><Link to="/berita-tjsl" className="inline-block bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700">Kembali ke Daftar Berita</Link></div>);

// --- MAIN COMPONENT ---
const ArtikelPage = () => {
  const { slug } = useParams();
  const [comments, setComments] = useState(initialComments);
  const article = articlesData.find((a) => a.slug === slug);

  if (!article) return <NotFound />;

  const handleCommentSubmit = (formData) => {
    const newComment = { id: Date.now(), author: formData.name, avatar: 'https://via.placeholder.com/48?text=' + formData.name.charAt(0).toUpperCase(), content: formData.comment, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'}) };
    setComments([newComment, ...comments]);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Container Utama */}
      <div className="container max-w-5xl mx-auto px-4 lg:px-8 py-12"> {/* Lebih lebar sedikit */}
        <Breadcrumbs category={article.category} title={article.title} />
        <ArticleHeader article={article} />
        <ArticleImage image={article.image} alt={article.title} />

        <main className="grid grid-cols-12 gap-8 mt-12">
            {/* Kolom Konten Artikel */}
            <div className="col-span-12 lg:col-span-8">
                 <ArticleContent content={article.fullContent} />
                 {/* Tombol Share */}
                 <div className="mt-10 pt-6 border-t flex justify-end">
                    <button className="flex items-center gap-2 bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition">
                        <FaShareAlt /> Share
                    </button>
                 </div>
            </div>

             {/* Sidebar Sederhana (Opsional) */}
             <aside className="col-span-12 lg:col-span-4 space-y-8 lg:mt-0 mt-12">
                <section className="bg-gray-50 p-6 rounded-lg border">
                    <h3 className="font-bold text-xl mb-4">Artikel Terkait</h3>
                    <ul className="space-y-3">
                        {articlesData.filter(a => a.id !== article.id).slice(0, 3).map(a => (
                        <li key={a.id}>
                            <Link to={`/artikel/${a.slug}`} className="text-blue-600 hover:underline hover:text-blue-800 transition-colors">
                            {a.title}
                            </Link>
                        </li>
                        ))}
                    </ul>
                </section>
             </aside>
        </main>
      </div>

      {/* Section Komentar */}
      <section className="bg-gray-100 py-16 mt-16" aria-labelledby="comments-section-heading">
        <div className="container max-w-4xl mx-auto px-4 lg:px-8">
          <CommentForm onSubmit={handleCommentSubmit} />
          <CommentsSection comments={comments} />
        </div>
      </section>
    </div>
  );
};

export default ArtikelPage;