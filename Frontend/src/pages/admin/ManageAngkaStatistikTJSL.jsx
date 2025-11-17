import React, { useState } from 'react';
import { FaSave, FaEdit, FaUsers, FaBuilding, FaSolarPanel, FaBook, FaHandsHelping, FaUndo } from 'react-icons/fa';

// Data Dummy - nanti diganti dengan API
const initialStatistik = {
    penerimaManfaat: {
        value: 99500,
        label: 'Penerimaan Manfaat',
        unit: 'Jiwa',
        icon: <FaUsers className="w-8 h-8" />,
        description: 'Total masyarakat yang menerima manfaat dari program TJSL'
    },
    infrastruktur: {
        value: 4,
        label: 'Infrastruktur Terbangun',
        unit: 'Unit',
        icon: <FaBuilding className="w-8 h-8" />,
        description: 'Jumlah infrastruktur yang telah dibangun (sekolah, klinik, dll)'
    },
    ebtke: {
        value: 8,
        label: 'Unit EBTKE',
        unit: 'Unit',
        icon: <FaSolarPanel className="w-8 h-8" />,
        description: 'Energi Baru Terbarukan dan Konservasi Energi'
    },
    paketPendidikan: {
        value: 800,
        label: 'Paket Pendidikan',
        unit: 'Paket',
        icon: <FaBook className="w-8 h-8" />,
        description: 'Total paket pendidikan yang telah disalurkan'
    },
    kelompokBinaan: {
        value: 3,
        label: 'Kelompok Binaan',
        unit: 'Kelompok',
        icon: <FaHandsHelping className="w-8 h-8" />,
        description: 'Jumlah kelompok masyarakat yang dibina'
    }
};

const ManageAngkaStatistikTJSL = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [statistik, setStatistik] = useState(initialStatistik);
    const [tempStatistik, setTempStatistik] = useState(initialStatistik);

    const handleEdit = () => {
        setTempStatistik({ ...statistik });
        setIsEditing(true);
    };

    const handleCancel = () => {
        if (window.confirm('Apakah Anda yakin ingin membatalkan perubahan?')) {
            setTempStatistik({ ...statistik });
            setIsEditing(false);
        }
    };

    const handleChange = (key, value) => {
        setTempStatistik(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                value: value === '' ? 0 : parseInt(value) || 0
            }
        }));
    };

    const handleSave = () => {
        if (window.confirm('Apakah Anda yakin ingin menyimpan perubahan statistik?')) {
            // TODO: Kirim data ke backend API
            console.log('Saving statistik:', tempStatistik);
            
            setStatistik({ ...tempStatistik });
            setIsEditing(false);
            alert('Statistik TJSL berhasil diupdate!');
        }
    };

    const handleReset = () => {
        if (window.confirm('Apakah Anda yakin ingin reset ke nilai awal? Semua perubahan akan hilang!')) {
            setStatistik(initialStatistik);
            setTempStatistik(initialStatistik);
            setIsEditing(false);
            alert('Statistik telah direset ke nilai awal!');
        }
    };

    const formatNumber = (num) => {
        if (num >= 1000) {
            return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        }
        return num.toLocaleString('id-ID');
    };

    const displayData = isEditing ? tempStatistik : statistik;

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Kelola Angka Statistik TJSL</h1>
                    <p className="text-gray-600 mt-1">Update angka "Fokus Utama TJSL Kami" di halaman TJSL</p>
                </div>
                <div className="flex gap-3">
                    {!isEditing ? (
                        <>
                            <button
                                onClick={handleEdit}
                                className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                            >
                                <FaEdit />
                                Edit Statistik
                            </button>
                            <button
                                onClick={handleReset}
                                className="flex items-center gap-2 bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                <FaUndo />
                                Reset
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={handleCancel}
                                className="flex items-center gap-2 bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-2 bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-green-700 transition-colors"
                            >
                                <FaSave />
                                Simpan Perubahan
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Info Alert */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-semibold text-blue-900 mb-1">Informasi</h3>
                        <p className="text-sm text-blue-800">
                            Statistik ini akan ditampilkan di section <strong>"Fokus Utama TJSL Kami"</strong> pada halaman TJSL.
                            Pastikan data yang diinput sudah akurat dan sesuai dengan laporan terbaru.
                        </p>
                    </div>
                </div>
            </div>

            {/* Preview Cards */}
            <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                    {isEditing ? '✏️ Mode Edit - Update Nilai' : '👁️ Preview Tampilan'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(displayData).map(([key, item]) => (
                        <div 
                            key={key}
                            className={`bg-white rounded-xl shadow-md p-6 border-2 transition-all ${
                                isEditing 
                                    ? 'border-blue-300 hover:shadow-lg' 
                                    : 'border-gray-100 hover:border-blue-200 hover:shadow-lg'
                            }`}
                        >
                            {/* Icon & Label */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                                    {item.icon}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-semibold text-gray-700">
                                        {item.label}
                                    </h3>
                                </div>
                            </div>

                            {/* Value Input/Display */}
                            {isEditing ? (
                                <div className="mb-3">
                                    <label className="block text-xs font-medium text-gray-600 mb-2">
                                        Nilai:
                                    </label>
                                    <input
                                        type="number"
                                        value={item.value}
                                        onChange={(e) => handleChange(key, e.target.value)}
                                        className="w-full px-4 py-3 text-2xl font-bold border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        min="0"
                                    />
                                </div>
                            ) : (
                                <div className="mb-3">
                                    <div className="text-4xl font-bold text-blue-600">
                                        {formatNumber(item.value)}+
                                    </div>
                                </div>
                            )}

                            {/* Unit & Description */}
                            <div className="text-sm text-gray-600 mb-2">
                                <span className="font-semibold">{item.unit}</span>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Detail Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900">Detail Statistik</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Kategori
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nilai Saat Ini
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Unit
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tampilan di Website
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {Object.entries(statistik).map(([key, item]) => (
                                <tr key={key} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                                {item.icon}
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-gray-900">
                                                    {item.label}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {item.description}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-2xl font-bold text-blue-600">
                                            {item.value.toLocaleString('id-ID')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                            {item.unit}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-lg font-bold text-gray-700">
                                            {formatNumber(item.value)}+
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            ({item.value.toLocaleString('id-ID')} {item.unit})
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footer Info */}
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                        <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-semibold text-yellow-900 mb-1">Penting!</h3>
                        <p className="text-sm text-yellow-800">
                            Data statistik yang diupdate akan langsung terlihat di halaman publik. 
                            Pastikan data sudah diverifikasi sebelum menyimpan perubahan.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageAngkaStatistikTJSL;