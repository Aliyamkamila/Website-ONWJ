import { useState, useEffect, useMemo } from 'react';
import { hargaMinyakService } from '../../services/HargaMinyakService';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { FaChartLine, FaOilCan, FaArrowUp, FaArrowDown, FaCalendarAlt, FaTimes, FaSpinner } from 'react-icons/fa';

// ========== CONSTANTS ==========
const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const FILTER_OPTIONS = [
  { id: 'day', label: 'Harian', icon: '📅' },
  { id:  'week', label: 'Mingguan', icon: '📆' },
  { id: 'month', label: 'Bulanan', icon: '📊' },
  { id: 'year', label: 'Tahunan', icon: '📈' },
];

const OIL_TYPES = {
  brent: { label: 'Brent Crude', color: '#3b82f6', gradient: 'from-blue-500 to-blue-600' },
  duri: { label: 'Duri Crude', color: '#f59e0b', gradient: 'from-amber-500 to-amber-600' },
  arjuna: { label: 'Arjuna Crude', color: '#10b981', gradient: 'from-emerald-500 to-emerald-600' },
  kresna: { label: 'Kresna Crude', color: '#8b5cf6', gradient:  'from-violet-500 to-violet-600' },
  icp: { label: 'ICP', color: '#ec4899', gradient: 'from-pink-500 to-pink-600' },
};

const YEARS = ['2021', '2022', '2023', '2024', '2025'];

// ========== UTILITY FUNCTIONS ==========
const calculateChange = (current, previous) => 
  previous ?  ((current - previous) / previous) * 100 : 0;

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
};

// ========== COMPONENTS ==========
const CustomTooltip = ({ active, payload }) => {
  if (! active || !payload?.length) return null;

  return (
    <div className="bg-white p-4 rounded-xl shadow-xl border-2 border-gray-100">
      <p className="font-semibold text-gray-900 mb-3 text-sm">
        {payload[0]?.payload?.fullLabel}
      </p>
      <div className="space-y-2">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full shadow-sm"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600 text-xs">{entry.name}</span>
            </div>
            <span className="font-bold text-sm" style={{ color: entry.color }}>
              ${entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const StatsCard = ({ title, value, change, color, gradient }) => {
  const isPositive = change >= 0;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover: scale-105">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-md`}>
          <FaOilCan className="w-6 h-6 text-white" />
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${
          isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {isPositive ? <FaArrowUp className="w-3 h-3" /> : <FaArrowDown className="w-3 h-3" />}
          {Math.abs(change).toFixed(2)}%
        </div>
      </div>
      <h4 className="text-sm text-gray-500 font-medium mb-2">{title}</h4>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold" style={{ color }}>
          ${value}
        </p>
        <span className="text-sm text-gray-400 font-medium">/bbl</span>
      </div>
    </div>
  );
};

const FilterModal = ({ isOpen, onClose, filterType, rangeFrom, rangeTo, onApply }) => {
  const [tempFrom, setTempFrom] = useState(rangeFrom);
  const [tempTo, setTempTo] = useState(rangeTo);

  useEffect(() => {
    setTempFrom(rangeFrom);
    setTempTo(rangeTo);
  }, [rangeFrom, rangeTo, isOpen]);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply(tempFrom, tempTo);
    onClose();
  };

  const getLabel = () => {
    switch (filterType) {
      case 'day':  return 'Tanggal';
      case 'week': return 'Minggu';
      case 'month':  return 'Bulan';
      case 'year': return 'Tahun';
      default: return '';
    }
  };

  const getRangeDisplay = () => {
    switch (filterType) {
      case 'day': 
        return `${formatDate(tempFrom)} - ${formatDate(tempTo)}`;
      case 'month':
        return `${MONTHS[tempFrom]} - ${MONTHS[tempTo]} 2025`;
      case 'year':
        return `${tempFrom} - ${tempTo}`;
      default:
        return '';
    }
  };

  const calculateDataCount = () => {
    switch (filterType) {
      case 'day':
        const start = new Date(tempFrom);
        const end = new Date(tempTo);
        const diffTime = Math.abs(end - start);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      case 'month':
        return tempTo - tempFrom + 1;
      case 'year':
        return parseInt(tempTo) - parseInt(tempFrom) + 1;
      default:
        return 0;
    }
  };

  const renderInputs = () => {
    switch (filterType) {
      case 'day':
        return (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Dari Tanggal</label>
              <input
                type="date"
                value={tempFrom}
                onChange={(e) => {
                  setTempFrom(e.target.value);
                  if (e.target.value > tempTo) setTempTo(e.target.value);
                }}
                max="2025-12-31"
                min="2021-01-01"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700 font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sampai Tanggal</label>
              <input
                type="date"
                value={tempTo}
                onChange={(e) => setTempTo(e.target.value)}
                min={tempFrom}
                max="2025-12-31"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700 font-medium"
              />
            </div>
          </>
        );

      case 'month':
        return (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Dari Bulan</label>
              <select
                value={tempFrom}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setTempFrom(val);
                  if (val > tempTo) setTempTo(val);
                }}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus: ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700 font-medium"
              >
                {MONTHS.map((month, index) => (
                  <option key={index} value={index}>{month}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sampai Bulan</label>
              <select
                value={tempTo}
                onChange={(e) => setTempTo(parseInt(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus: ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700 font-medium"
              >
                {MONTHS.map((month, index) => (
                  <option key={index} value={index} disabled={index < tempFrom}>{month}</option>
                ))}
              </select>
            </div>
          </>
        );

      case 'year':
        return (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Dari Tahun</label>
              <select
                value={tempFrom}
                onChange={(e) => {
                  setTempFrom(e.target.value);
                  if (parseInt(e.target.value) > parseInt(tempTo)) setTempTo(e.target.value);
                }}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700 font-medium"
              >
                {YEARS.map(year => <option key={year} value={year}>{year}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sampai Tahun</label>
              <select
                value={tempTo}
                onChange={(e) => setTempTo(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700 font-medium"
              >
                {YEARS.map(year => (
                  <option key={year} value={year} disabled={parseInt(year) < parseInt(tempFrom)}>{year}</option>
                ))}
              </select>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 animate-slideUp">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaCalendarAlt className="text-blue-600 w-5 h-5" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Filter Periode {getLabel()}</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-all">
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 mb-6">{renderInputs()}</div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-100 rounded-xl p-4 mb-6">
          <p className="text-sm text-blue-900 font-medium">
            📊 Periode:  <span className="font-bold">{getRangeDisplay()}</span>
          </p>
          <p className="text-xs text-blue-700 mt-1">
            Menampilkan {calculateDataCount()} data {getLabel().toLowerCase()}
          </p>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all">
            Batal
          </button>
          <button onClick={handleApply} className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover: from-blue-700 hover: to-blue-800 shadow-lg transition-all">
            Terapkan
          </button>
        </div>
      </div>
    </div>
  );
};

// ========== MAIN COMPONENT ==========
const HargaMinyakPage = () => {
  const [activeFilter, setActiveFilter] = useState('month');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [chartData, setChartData] = useState([]);
  const [stats, setStats] = useState({});
  
  const [dayRange, setDayRange] = useState({ from: '2025-01-01', to: '2025-01-31' });
  const [monthRange, setMonthRange] = useState({ from: 0, to: 11 });
  const [yearRange, setYearRange] = useState({ from: '2021', to: '2025' });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        periode: activeFilter,
      };

      if (activeFilter === 'day') {
        params.from = dayRange.from;
        params.to = dayRange.to;
      } else if (activeFilter === 'month') {
        const fromDate = `2025-${String(monthRange.from + 1).padStart(2, '0')}-01`;
        const toMonth = monthRange.to + 1;
        const toDate = `2025-${String(toMonth).padStart(2, '0')}-${new Date(2025, toMonth, 0).getDate()}`;
        params.from = fromDate;
        params.to = toDate;
      } else if (activeFilter === 'year') {
        params.from = `${yearRange.from}-01-01`;
        params.to = `${yearRange.to}-12-31`;
      }

      const response = await hargaMinyakService.getAll(params);
      
      if (response.data.success) {
        setChartData(response.data.data.chartData);
        setStats(response.data.data.stats);
      } else {
        setError('Gagal memuat data');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.response?.data?.message || 'Terjadi kesalahan saat memuat data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeFilter, dayRange, monthRange, yearRange]);

  const getCurrentRange = () => {
    switch (activeFilter) {
      case 'day':  return dayRange;
      case 'month': return monthRange;
      case 'year': return yearRange;
      default: return { from:  0, to: 10 };
    }
  };

  const handleApplyFilter = (from, to) => {
    switch (activeFilter) {
      case 'day':  setDayRange({ from, to }); break;
      case 'month': setMonthRange({ from, to }); break;
      case 'year': setYearRange({ from, to }); break;
    }
  };

  const getPeriodLabel = () => {
    const range = getCurrentRange();
    
    switch (activeFilter) {
      case 'day': 
        return `${formatDate(range.from)} - ${formatDate(range.to)}`;
      case 'month':
        return `${MONTHS[range.from]} - ${MONTHS[range.to]} 2025`;
      case 'year':
        return `${range.from} - ${range.to}`;
      default:
        return 'Semua Data';
    }
  };

  const statsCards = useMemo(() => {
    if (!stats || Object.keys(stats).length === 0) return [];
    
    return Object.entries(OIL_TYPES).map(([key, oilType]) => ({
      title: oilType.label,
      value: stats[key]?.current || 0,
      change:  stats[key]?.change || 0,
      color: oilType.color,
      gradient: oilType.gradient,
    }));
  }, [stats]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-semibold">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Terjadi Kesalahan</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchData}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg: px-8 max-w-7xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
              <FaChartLine className="text-white w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Harga Minyak Dunia</h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Pantau perkembangan harga minyak mentah secara real-time
          </p>
        </div>

        <div className="grid grid-cols-1 md: grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex gap-2 flex-wrap">
              {FILTER_OPTIONS.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                    activeFilter === filter.id
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-lg">{filter.icon}</span>
                  <span>{filter.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsFilterOpen(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg"
            >
              <FaCalendarAlt className="w-4 h-4" />
              <span>Filter Periode</span>
            </button>
          </div>

          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-100">
            <p className="text-sm font-medium text-blue-900">
              📅 Periode: <span className="font-bold">{getPeriodLabel()}</span>
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Menampilkan {chartData.length} data periode
            </p>
          </div>

          <div className="h-[450px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  {Object.entries(OIL_TYPES).map(([key, oil]) => (
                    <linearGradient key={key} id={`color${key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={oil.color} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={oil.color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
                <XAxis
                  dataKey="label"
                  tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }}
                  tickLine={{ stroke: '#e5e7eb' }}
                  axisLine={{ stroke: '#d1d5db' }}
                />
                <YAxis
                  tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }}
                  tickLine={{ stroke: '#e5e7eb' }}
                  axisLine={{ stroke:  '#d1d5db' }}
                  domain={['dataMin - 5', 'dataMax + 5']}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop:  '20px' }} 
                  iconType="circle"
                  formatter={(value) => <span className="font-semibold text-gray-700">{value}</span>}
                />
                {Object.entries(OIL_TYPES).map(([key, oil]) => (
                  <Area
                    key={key}
                    type="monotone"
                    dataKey={key}
                    name={oil.label}
                    stroke={oil.color}
                    strokeWidth={3}
                    fillOpacity={1}
                    fill={`url(#color${key})`}
                    dot={{ fill: oil.color, strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: oil.color, strokeWidth: 3 }}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-8 pt-6 border-t-2 border-gray-100">
            <div className="flex flex-wrap justify-between items-center gap-4 text-sm text-gray-500">
              <div>
                <span className="font-semibold text-gray-700">Total Data:</span> {chartData.length} periode
              </div>
              <div>
                <span className="font-semibold text-gray-700">Sumber:</span> Data Real-time
              </div>
            </div>
          </div>
        </div>
      </div>

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filterType={activeFilter}
        rangeFrom={getCurrentRange().from}
        rangeTo={getCurrentRange().to}
        onApply={handleApplyFilter}
      />

    </div>
  );
};

export default HargaMinyakPage;