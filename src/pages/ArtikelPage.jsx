// src/pages/ArtikelPage.jsx
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

// Ikon
import { FaShareAlt, FaHome, FaTwitter, FaLinkedin, FaWhatsapp } from 'react-icons/fa'; // Pastikan react-icons sudah terinstall

// Placeholder Images
import articleImage from '../assets/rectangle.png';
import authorAvatar from '../assets/logo.webp'; // Kita pakai logo sebagai placeholder avatar penulis

// --- DATA ARTIKEL LENGKAP (SINKRON DENGAN 12 ARTIKEL DI BERITATJSLPAGE) ---
const articlesData = [
    { id: 1, slug: 'social-impact-assessment-and-community-involvement', category: 'Community Development', date: 'January 15, 2025', title: 'Social Impact Assessment and Community Involvement', description: 'We are committed to drive positive impact...', image: articleImage, fullContent: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>`, tags: ['Komunitas', 'Penilaian Dampak', 'TJSL'] },
    { id: 2, slug: 'new-tree-planting-initiative-for-greener-future', category: 'Environment', date: 'December 22, 2024', title: 'New Tree Planting Initiative for a Greener Future', description: 'A new initiative focused on environmental sustainability...', image: articleImage, fullContent: `<p>Konten lengkap untuk artikel 2. Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>`, tags: ['Lingkungan', 'Penanaman Pohon', 'Konservasi'] },
    { id: 3, slug: 'artikel-ketiga-yang-baru', category: 'Environment', date: 'December 22, 2024', title: 'Artikel Ketiga yang Baru', description: 'Deskripsi artikel ketiga...', image: articleImage, fullContent: `<p>Konten lengkap untuk artikel 3. Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>`, tags: ['Lingkungan', 'Energi Terbarukan'] },
    { id: 4, slug: 'artikel-keempat-yang-baru', category: 'Community Development', date: 'January 15, 2025', title: 'Artikel Keempat yang Baru', description: 'Deskripsi artikel keempat...', image: articleImage, fullContent: `<p>Konten lengkap untuk artikel 4. Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>`, tags: ['Komunitas', 'Pendidikan'] },
    { id: 5, slug: 'artikel-kelima', category: 'Environment', date: 'November 10, 2024', title: 'Artikel Kelima', description: 'Deskripsi artikel kelima...', image: articleImage, fullContent: `<p>Konten lengkap untuk artikel 5. Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>`, tags: ['Lingkungan'] },
    { id: 6, slug: 'artikel-keenam', category: 'Community Development', date: 'October 5, 2024', title: 'Artikel Keenam', description: 'Deskripsi artikel keenam...', image: articleImage, fullContent: `<p>Konten lengkap untuk artikel 6. Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>`, tags: ['Komunitas', 'Kesehatan'] },
    { id: 7, slug: 'artikel-ketujuh', category: 'Environment', date: 'September 20, 2024', title: 'Artikel Ketujuh', description: 'Deskripsi artikel ketujuh...', image: articleImage, fullContent: `<p>Konten lengkap untuk artikel 7. Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>`, tags: ['Lingkungan', 'Penelitian'] },
    { id: 8, slug: 'artikel-kedelapan', category: 'Community Development', date: 'August 15, 2024', title: 'Artikel Kedelapan', description: 'Deskripsi artikel kedelapan...', image: articleImage, fullContent: `<p>Konten lengkap untuk artikel 8. Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>`, tags: ['Komunitas', 'Ekonomi'] },
    { id: 9, slug: 'artikel-kesembilan', category: 'Environment', date: 'July 1, 2024', title: 'Artikel Kesembilan', description: 'Deskripsi artikel kesembilan...', image: articleImage, fullContent: `<p>Konten lengkap untuk artikel 9. Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>`, tags: ['Lingkungan', 'Air Bersih'] },
    { id: 10, slug: 'artikel-kesepuluh', category: 'Community Development', date: 'June 10, 2024', title: 'Artikel Kesepuluh', description: 'Deskripsi artikel kesepuluh...', image: articleImage, fullContent: `<p>Konten lengkap untuk artikel 10. Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>`, tags: ['Komunitas', 'Infrastruktur'] },
    { id: 11, slug: 'artikel-kesebelas', category: 'Environment', date: 'May 5, 2024', title: 'Artikel Kesebelas', description: 'Deskripsi artikel kesebelas...', image: articleImage, fullContent: `<p>Konten lengkap untuk artikel 11. Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>`, tags: ['Lingkungan', 'Biodiversitas'] },
    { id: 12, slug: 'artikel-keduabelas', category: 'Community Development', date: 'April 20, 2024', title: 'Artikel Keduabelas', description: 'Deskripsi artikel keduabelas...', image: articleImage, fullContent: `<p>Konten lengkap untuk artikel 12. Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>`, tags: ['Komunitas', 'Beasiswa'] },
];


const initialComments = [
  { id: 1, author: 'Budi Santoso', avatar: 'https://via.placeholder.com/48?text=BS', content: 'Artikel yang sangat informatif!', date: 'Jan 10, 2025' },
  { id: 2, author: 'Siti Aminah', avatar: 'https://via.placeholder.com/48?text=SA', content: 'Terima kasih atas wawasannya.', date: 'Jan 12, 2025' },
];

// --- SUB-KOMPONEN ---

const Breadcrumbs = ({ category, title }) => (
  <nav aria-label="breadcrumb" className="mb-8 text-sm text-gray-500">
    <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
      <li className="inline-flex items-center">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <FaHome className="mr-2" /> Home
        </Link>
      </li>
      <li><div className="flex items-center"><span className="mx-1">/</span><Link to="/berita-tjsl" className="ms-1 text-blue-600 hover:text-blue-800">Berita TJSL</Link></div></li>
      <li aria-current="page"><div className="flex items-center"><span className="mx-1">/</span><span className="ms-1 text-gray-400 line-clamp-1">{title}</span></div></li>
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

const ArticleContent = ({ content }) => (
  <section className="prose prose-lg max-w-none prose-p:text-gray-600 prose-headings:text-gray-900 prose-a:text-blue-600 hover:prose-a:text-blue-800">
    <div dangerouslySetInnerHTML={{ __html: content }} />
  </section>
);

// --- KOMPONEN BARU: Author Box ---
const AuthorBox = () => (
    <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex items-center bg-gray-50 p-6 rounded-lg">
            <img src={authorAvatar} alt="Tim TJSL" className="w-16 h-16 rounded-full object-contain border-2 border-blue-100" />
            <div className="ml-4">
                <h4 className="text-lg font-bold text-gray-900">Ditulis oleh Tim TJSL</h4>
                <p className="text-gray-600 text-sm">Tim TJSL MUJ ONWJ berdedikasi untuk menciptakan dampak positif dan berkelanjutan bagi masyarakat dan lingkungan di wilayah operasi kami.</p>
            </div>
        </div>
    </div>
);

// --- KOMPONEN BARU: Tags Section ---
const TagsSection = ({ tags }) => (
    <div className="mt-8">
        <h3 className="font-semibold text-gray-700 mb-2">Tags:</h3>
        <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
                <span key={tag} className="text-sm bg-blue-50 text-blue-700 font-medium px-3 py-1 rounded-full">
                    #{tag}
                </span>
            ))}
        </div>
    </div>
);

// --- KOMPONEN BARU: Share Buttons ---
const ShareButtons = ({ title, slug }) => {
    const url = `https://website-onwj.com/artikel/${slug}`; // Ganti dengan URL aslimu nanti
    return (
        <div className="mt-10 pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-4">
            <span className='font-semibold text-gray-700'>Bagikan Artikel Ini:</span>
            <div className="flex gap-2">
                <a href={`https://twitter.com/intent/tweet?url=${url}&text=${title}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition">
                    <FaTwitter className="text-[#1DA1F2]" /> Twitter
                </a>
                <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition">
                    <FaLinkedin className="text-[#0A66C2]" /> LinkedIn
                </a>
                <a href={`https://api.whatsapp.com/send?text=${title} ${url}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition">
                    <FaWhatsapp className="text-[#25D366]" /> WhatsApp
                </a>
            </div>
        </div>
    );
};


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
      <div className="container max-w-5xl mx-auto px-4 lg:px-8 py-12">
        <Breadcrumbs category={article.category} title={article.title} />
        <ArticleHeader article={article} />
        <ArticleImage image={article.image} alt={article.title} />

        <main className="grid grid-cols-12 gap-8 lg:gap-12 mt-12">
            {/* Kolom Konten Artikel */}
            <div className="col-span-12 lg:col-span-8">
                 <ArticleContent content={article.fullContent} />
                 
                 {/* --- FITUR BARU DISISIPKAN DI SINI --- */}
                 {article.tags && <TagsSection tags={article.tags} />}
                 <AuthorBox />
                 <ShareButtons title={article.title} slug={article.slug} />
            </div>

             {/* Sidebar Artikel Terkait (DIPERBARUI) */}
             <aside className="col-span-12 lg:col-span-4 space-y-8 lg:mt-0 mt-12">
                <section className="bg-gray-50 p-6 rounded-lg border sticky top-28"> {/* Dibuat sticky */}
                    <h3 className="font-bold text-xl mb-4">Artikel Terkait</h3>
                    <ul className="space-y-3">
                        {/* Logika baru: filter by category, exclude self, limit 3 */}
                        {articlesData
                            .filter(a => a.category === article.category && a.id !== article.id)
                            .slice(0, 3)
                            .map(a => (
                                <li key={a.id}>
                                    <Link to={`/artikel/${a.slug}`} className="text-blue-600 hover:underline hover:text-blue-800 transition-colors line-clamp-2">
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