import { FaChartBar, FaIndustry } from 'react-icons/fa';

const DataProduksi = () => {
  return (
    <section className="py-12 bg-secondary-50">
      <div className="section-container">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-secondary-200 p-10 text-center">
            
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center">
                  <FaChartBar className="w-10 h-10 text-primary-600" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <FaIndustry className="w-5 h-5 text-amber-600" />
                </div>
              </div>
            </div>
            
            {/* Title */}
            <h2 className="text-2xl font-heading font-bold text-secondary-900 mb-3">
              📊 Data Produksi
            </h2>
            
            {/* Description */}
            <p className="text-body-md text-secondary-600 mb-6 leading-relaxed">
              Halaman ini sedang dalam pengembangan. Kami akan segera menyajikan data produksi lengkap.
            </p>
            
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-50 text-primary-700 rounded-lg border border-primary-200">
              <span className="w-2 h-2 rounded-full bg-primary-600 animate-pulse"></span>
              <span className="text-sm font-heading font-semibold">Coming Soon</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DataProduksi;