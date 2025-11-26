import { FaChartBar, FaIndustry } from 'react-icons/fa';

const DataProduksi = () => {
  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-8 lg:px-16">
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <FaChartBar className="w-20 h-20 text-blue-600" />
              <FaIndustry className="w-10 h-10 text-amber-500 absolute -bottom-2 -right-2" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            📊 Data Produksi
          </h2>
          
          <p className="text-gray-600 text-lg mb-6">
            Halaman ini sedang dalam pengembangan. 
          </p>
          
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-700 rounded-lg">
            <span className="animate-pulse">⚙️</span>
            <span className="font-medium">Coming Soon</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataProduksi;