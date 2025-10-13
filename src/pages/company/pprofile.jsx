import React from 'react';

const QuickFactCard = ({ icon, title, value, bgColor }) => (
  <div className={`${bgColor} p-6 rounded-xl hover:scale-105 transition-transform duration-300`}>
    <div className="flex items-start gap-4">
      <div className="p-3 bg-white/90 rounded-lg">
        {icon}
      </div>
      <div>
        <h4 className="font-medium text-gray-700">{title}</h4>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

const PProfile = () => {
  const quickFacts = [
    {
      icon: <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>,
      title: "Tahun Berdiri",
      value: "2016",
      bgColor: "bg-blue-50"
    },
    {
      icon: <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>,
      title: "Jumlah Karyawan",
      value: "1000+",
      bgColor: "bg-green-50"
    },
    {
      icon: <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>,
      title: "Wilayah Operasi",
      value: "6 Provinsi",
      bgColor: "bg-purple-50"
    },
    {
      icon: <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>,
      title: "Kapasitas Produksi",
      value: "500MW",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <div className="container mx-auto px-8 lg:px-16 py-16">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Profil Perusahaan</h2>
        <p className="text-gray-600 leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickFacts.map((fact, index) => (
          <QuickFactCard key={index} {...fact} />
        ))}
      </div>
    </div>
  );
};

export default PProfile;