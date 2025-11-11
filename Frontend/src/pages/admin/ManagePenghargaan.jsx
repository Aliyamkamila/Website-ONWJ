// src/pages/admin/ManagePenghargaan.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

// Data Dummy
const dummyAwards = [
    { id: 1, title: 'PROPER Emas', year: 2024, givenBy: 'Kementerian LHK' },
    { id: 2, title: 'Best HSE Performance', year: 2024, givenBy: 'Kementerian ESDM' },
];

const ManagePenghargaan = () => {
    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Kelola Penghargaan</h1>
                <Link
                    to="/admin/manage-penghargaan/tambah"
                    className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                >
                    <FaPlus />
                    <span>Tambah Penghargaan</span>
                </Link>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Penghargaan</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tahun</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diberikan Oleh</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {dummyAwards.map((award) => (
                            <tr key={award.id}>
                                <td className="px-6 py-4"><div className="text-sm font-medium text-gray-900">{award.title}</div></td>
                                <td className="px-6 py-4"><div className="text-sm text-gray-500">{award.year}</div></td>
                                <td className="px-6 py-4"><div className="text-sm text-gray-500">{award.givenBy}</div></td>
                                <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                                    <button className="text-indigo-600 hover:text-indigo-900" title="Edit"><FaEdit /></button>
                                    <button className="text-red-600 hover:text-red-900" title="Hapus"><FaTrash /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManagePenghargaan;   