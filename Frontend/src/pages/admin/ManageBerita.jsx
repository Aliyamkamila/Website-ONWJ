// src/pages/admin/ManageBerita.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

// --- DATA DUMMY (Nanti ini kita ambil dari database) ---
const dummyArticles = [
    { id: 1, title: 'Social Impact Assessment...', category: 'Community Development', date: 'Jan 15, 2025' },
    { id: 2, title: 'New Tree Planting Initiative...', category: 'Environment', date: 'Dec 22, 2024' },
    { id: 3, title: 'Artikel Ketiga yang Baru', category: 'Environment', date: 'Dec 22, 2024' },
];

const ManageBerita = () => {
    
    const handleEdit = (id) => {
        alert(`Nanti kita edit artikel ID: ${id}`);
        // Logika untuk navigasi ke halaman edit
    };

    const handleDelete = (id) => {
        if (window.confirm(`Yakin mau hapus artikel ID: ${id}?`)) {
            alert(`Nanti kita hapus artikel ID: ${id} dari database`);
            // Logika untuk call API delete
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Kelola Berita
                </h1>
                <Link
                    to="/admin/manage-berita/tambah" // Nanti kita buat halaman form-nya
                    className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                >
                    <FaPlus />
                    <span>Tambah Berita Baru</span>
                </Link>
            </div>

            {/* Tabel Data Berita */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {dummyArticles.map((article) => (
                            <tr key={article.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{article.title}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                        {article.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{article.date}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <button
                                        onClick={() => handleEdit(article.id)}
                                        className="text-indigo-600 hover:text-indigo-900"
                                        title="Edit"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(article.id)}
                                        className="text-red-600 hover:text-red-900"
                                        title="Hapus"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageBerita;