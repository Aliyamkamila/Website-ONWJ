// src/pages/admin/DashboardPage.jsx
import React from 'react';

const DashboardPage = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Selamat Datang, Admin!
            </h1>
            <p className="text-gray-600">
                Pilih menu di sidebar kiri untuk mulai mengelola konten website.
            </p>
            {/* Nanti di sini kita bisa tambahkan statistik singkat */}
        </div>
    );
};

export default DashboardPage;