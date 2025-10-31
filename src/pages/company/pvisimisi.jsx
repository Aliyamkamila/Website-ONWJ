import React from 'react';

const Card = ({ title, content, icon, color, fullWidth = false }) => (
  <div 
    className={`
      ${color} ${fullWidth ? 'col-span-full' : ''} 
      p-8 rounded-2xl 
      transition-all duration-300 ease-out
      hover:shadow-lg hover:-translate-y-1
      border border-transparent hover:border-primary-200
    `}
  >
    <div className="flex items-start gap-4 mb-4">
      <div className="flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-600 leading-relaxed text-base">{content}</p>
      </div>
    </div>
  </div>
);

const MissionCard = ({ number, content, icon, color }) => (
  <div 
    className={`
      ${color} p-6 rounded-xl 
      transition-all duration-300 ease-out
      hover:shadow-md hover:-translate-y-1
      border border-transparent hover:border-green-200
    `}
  >
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0">
        <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
          {number}
        </div>
      </div>
      <div className="flex-1">
        <p className="text-gray-700 leading-relaxed text-sm">{content}</p>
      </div>
    </div>
  </div>
);

const PVisiMisi = () => {
  const visi = {
    title: "Visi",
    content: "Menjadi Perusahaan Terbaik di Indonesia dalam Bidang Pengelolaan PI 10% Daerah",
    color: "bg-blue-50",
    icon: (
      <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    )
  };

  const nilai = {
    title: "Nilai-Nilai Perusahaan",
    content: "Integritas, Profesionalisme, Inovasi, Kolaborasi, dan Berkelanjutan merupakan nilai-nilai inti yang menjadi landasan setiap keputusan dan tindakan kami dalam mengelola Partisipasi Indonesia 10% daerah.",
    color: "bg-purple-50",
    icon: (
      <svg className="w-10 h-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    )
  };

  const misiList = [
    {
      number: 1,
      content: "Optimalisasi manfaat PI 10% kepada masyarakat terutama pada area WK ONWJ dengan fokus pada pembangunan infrastruktur dan program pemberdayaan",
      color: "bg-green-50",
    },
    {
      number: 2,
      content: "Berperan aktif dalam pengelolaan WK ONWJ sebagai pemegang hak PI daerah dengan mengedepankan transparansi dan akuntabilitas",
      color: "bg-green-50",
    },
    {
      number: 3,
      content: "Memberikan kontribusi optimal kepada Pemegang Saham melalui pengelolaan aset yang efisien dan peningkatan nilai tambah berkelanjutan",
      color: "bg-green-50",
    }
  ];

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Visi, Misi & Nilai Perusahaan
          </h2>
          <div className="w-24 h-1 bg-primary-600 mx-auto rounded-full"></div>
        </div>
        
        {/* Visi & Nilai Grid - Full Width Cards */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 mb-12">
          <Card {...visi} />
          <Card {...nilai} />
        </div>

        {/* Misi Section */}
        <div className="mt-12 lg:mt-16">
          {/* Misi Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <svg className="w-10 h-10 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">Misi</h3>
            </div>
          </div>

          {/* Misi Cards Grid */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {misiList.map((misi, index) => (
              <MissionCard key={index} {...misi} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PVisiMisi;