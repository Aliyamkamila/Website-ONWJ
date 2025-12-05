import { useState, useMemo } from 'react';
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
import { FaChartLine, FaOilCan, FaArrowUp, FaArrowDown, FaCalendarAlt, FaTimes } from 'react-icons/fa';

// ========== CONSTANTS ==========
const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const FILTER_OPTIONS = [
  { id: 'day', label: 'Harian', icon: '📅' },
  { id: 'week', label: 'Mingguan', icon: '📆' },
  { id: 'month', label: 'Bulanan', icon: '📊' },
  { id: 'year', label: 'Tahunan', icon: '📈' },
];

const OIL_TYPES = {
  brent: { label: 'Brent Crude', color: '#3b82f6', gradient: 'from-blue-500 to-blue-600' },
  arjuna: { label: 'Arjuna Crude', color: '#10b981', gradient: 'from-emerald-500 to-emerald-600' },
};

const YEARS = ['2021', '2022', '2023', '2024', '2025'];

// ========== DATA GENERATION ==========
const generateDailyData = () => {
  const data = [];
  let dayCount = 0;
  
  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(2025, month + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(2025, month, day);
      const basePrice = 75 + Math.sin(dayCount * 0.1) * 10 + Math.random() * 3;
      
      data.push({
        id: dayCount,
        dayNumber: dayCount,
        date: date,
        dateStr: date.toISOString().split('T')[0],
        label: `${day}/${month + 1}`,
        fullLabel: `${day} ${MONTHS[month]} 2025`,
        brent: parseFloat((basePrice + Math.random() * 4).toFixed(2)),
        arjuna: parseFloat((basePrice - 2 + Math.random() * 3).toFixed(2)),
      });
      dayCount++;
    }
  }
  
  return data;
};

const generateWeeklyData = () => {
  const data = [];
  let weekCount = 0;

  MONTHS.forEach((month, monthIndex) => {
    const weeksInMonth = monthIndex === 1 ? 4 : monthIndex % 2 === 0 ? 5 : 4;
    
    for (let week = 1; week <= weeksInMonth; week++) {
      const basePrice = 75 + Math.sin(weekCount * 0.3) * 10 + Math.random() * 5;
      
      data.push({
        id: weekCount,
        weekNumber: weekCount,
        monthIndex: monthIndex,
        monthName: month,
        label: `W${week}`,
        fullLabel: `Minggu ${week}, ${month} 2025`,
        brent: parseFloat((basePrice + Math.random() * 3).toFixed(2)),
        arjuna: parseFloat((basePrice - 2 + Math.random() * 2.5).toFixed(2)),
      });
      weekCount++;
    }
  });

  return data;
};

const generateMonthlyData = () => {
  return MONTHS.map((month, index) => {
    const basePrice = 72 + Math.sin(index * 0.5) * 8 + index * 0.5;
    
    return {
      id: index,
      monthIndex: index,
      label: month.substring(0, 3),
      fullLabel: `${month} 2025`,
      brent: parseFloat((basePrice + 5 + Math.random() * 3).toFixed(2)),
      arjuna: parseFloat((basePrice + 2 + Math.random() * 2.5).toFixed(2)),
    };
  });
};

const generateYearlyData = () => {
  return YEARS.map((year, index) => {
    const basePrice = 60 + index * 5 + Math.random() * 10;
    
    return {
      id: index,
      yearIndex: index,
      yearValue: year,
      label: year,
      fullLabel: `Tahun ${year}`,
      brent: parseFloat((basePrice + 8 + Math.random() * 5).toFixed(2)),
      arjuna: parseFloat((basePrice + 5 + Math.random() * 4).toFixed(2)),
    };
  });
};

// Generate all data
const ALL_DATA = {
  day: generateDailyData(),
  week: generateWeeklyData(),
  month: generateMonthlyData(),
  year: generateYearlyData(),
};

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
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:scale-105">
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

  if (!isOpen) return null;

  const handleApply = () => {
    onApply(tempFrom, tempTo);
    onClose();
  };

  const getLabel = () => {
    switch (filterType) {
      case 'day':
        return 'Tanggal';
      case 'week':
        return 'Minggu';
      case 'month':
        return 'Bulan';
      case 'year':
        return 'Tahun';
      default:
        return '';
    }
  };

  const getRangeDisplay = () => {
    switch (filterType) {
      case 'day':
        return `${formatDate(tempFrom)} - ${formatDate(tempTo)}`;
      case 'week':
        const fromWeek = ALL_DATA.week.find(w => w.weekNumber === tempFrom);
        const toWeek = ALL_DATA.week.find(w => w.weekNumber === tempTo);
        return `${fromWeek?.fullLabel || ''} - ${toWeek?.fullLabel || ''}`;
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
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return diffDays;
      case 'week':
        return tempTo - tempFrom + 1;
      case 'month':
        return tempTo - tempFrom + 1;
      case 'year':
        const yearFrom = parseInt(tempFrom);
        const yearTo = parseInt(tempTo);
        return yearTo - yearFrom + 1;
      default:
        return 0;
    }
  };

  // Render input berdasarkan tipe filter
  const renderInputs = () => {
    switch (filterType) {
      case 'day':
        // Input date picker untuk harian
        return (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Dari Tanggal
              </label>
              <input
                type="date"
                value={tempFrom}
                onChange={(e) => {
                  setTempFrom(e.target.value);
                  if (e.target.value > tempTo) setTempTo(e.target.value);
                }}
                max="2025-12-31"
                min="2025-01-01"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700 font-medium"
              />
              <p className="text-xs text-gray-500 mt-1">📅 {formatDate(tempFrom)}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sampai Tanggal
              </label>
              <input
                type="date"
                value={tempTo}
                onChange={(e) => setTempTo(e.target.value)}
                min={tempFrom}
                max="2025-12-31"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700 font-medium"
              />
              <p className="text-xs text-gray-500 mt-1">📅 {formatDate(tempTo)}</p>
            </div>
          </>
        );

      case 'week':
        // Input minggu dengan bulan selector yang lebih mudah dipahami
        return (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Dari Minggu
              </label>
              <select
                value={tempFrom}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setTempFrom(val);
                  if (val > tempTo) setTempTo(val);
                }}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700 font-medium"
              >
                {ALL_DATA.week.map((week) => (
                  <option key={week.weekNumber} value={week.weekNumber}>
                    {week.fullLabel}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sampai Minggu
              </label>
              <select
                value={tempTo}
                onChange={(e) => setTempTo(parseInt(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700 font-medium"
              >
                {ALL_DATA.week.map((week) => (
                  <option 
                    key={week.weekNumber} 
                    value={week.weekNumber}
                    disabled={week.weekNumber < tempFrom}
                  >
                    {week.fullLabel}
                  </option>
                ))}
              </select>
            </div>
          </>
        );

      case 'month':
        // Input bulan dengan nama bulan yang mudah dipahami
        return (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Dari Bulan
              </label>
              <select
                value={tempFrom}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setTempFrom(val);
                  if (val > tempTo) setTempTo(val);
                }}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700 font-medium"
              >
                {MONTHS.map((month, index) => (
                  <option key={index} value={index}>
                    {month} 2025
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sampai Bulan
              </label>
              <select
                value={tempTo}
                onChange={(e) => setTempTo(parseInt(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700 font-medium"
              >
                {MONTHS.map((month, index) => (
                  <option key={index} value={index} disabled={index < tempFrom}>
                    {month} 2025
                  </option>
                ))}
              </select>
            </div>
          </>
        );

      case 'year':
        // Input tahun dengan year picker yang simple
        return (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Dari Tahun
              </label>
              <select
                value={tempFrom}
                onChange={(e) => {
                  const val = e.target.value;
                  setTempFrom(val);
                  if (parseInt(val) > parseInt(tempTo)) setTempTo(val);
                }}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700 font-medium"
              >
                {YEARS.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sampai Tahun
              </label>
              <select
                value={tempTo}
                onChange={(e) => setTempTo(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700 font-medium"
              >
                {YEARS.map((year) => (
                  <option key={year} value={year} disabled={parseInt(year) < parseInt(tempFrom)}>
                    {year}
                  </option>
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
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaCalendarAlt className="text-blue-600 w-5 h-5" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Filter Periode {getLabel()}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-all"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Inputs */}
        <div className="space-y-5 mb-6">
          {renderInputs()}
        </div>

        {/* Info */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-100 rounded-xl p-4 mb-6">
          <p className="text-sm text-blue-900 font-medium">
            📊 Periode: <span className="font-bold">{getRangeDisplay()}</span>
          </p>
          <p className="text-xs text-blue-700 mt-1">
            Menampilkan {calculateDataCount()} data {getLabel().toLowerCase()}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
          >
            Batal
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 shadow-lg transition-all"
          >
            Terapkan
          </button>
        </div>
      </div>
    </div>
  );
};

// ========== MAIN COMPONENT ==========
const HargaMinyak = () => {
  const [activeFilter, setActiveFilter] = useState('month');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Range states untuk setiap filter type
  const [dayRange, setDayRange] = useState({ from: '2025-01-01', to: '2025-01-31' });
  const [weekRange, setWeekRange] = useState({ from: 0, to: 9 });
  const [monthRange, setMonthRange] = useState({ from: 0, to: 11 });
  const [yearRange, setYearRange] = useState({ from: '2021', to: '2025' });

  // Get current range based on active filter
  const getCurrentRange = () => {
    switch (activeFilter) {
      case 'day':
        return dayRange;
      case 'week':
        return weekRange;
      case 'month':
        return monthRange;
      case 'year':
        return yearRange;
      default:
        return { from: 0, to: 10 };
    }
  };

  // Handle filter apply
  const handleApplyFilter = (from, to) => {
    switch (activeFilter) {
      case 'day':
        setDayRange({ from, to });
        break;
      case 'week':
        setWeekRange({ from, to });
        break;
      case 'month':
        setMonthRange({ from, to });
        break;
      case 'year':
        setYearRange({ from, to });
        break;
    }
  };

  // Filter data based on range
  const chartData = useMemo(() => {
    const allData = ALL_DATA[activeFilter] || ALL_DATA.month;
    const range = getCurrentRange();
    
    switch (activeFilter) {
      case 'day':
        return allData.filter((item) => 
          item.dateStr >= range.from && item.dateStr <= range.to
        );
      case 'week':
        return allData.filter((item) => 
          item.weekNumber >= range.from && item.weekNumber <= range.to
        );
      case 'month':
        return allData.filter((item) => 
          item.monthIndex >= range.from && item.monthIndex <= range.to
        );
      case 'year':
        return allData.filter((item) => 
          parseInt(item.yearValue) >= parseInt(range.from) && 
          parseInt(item.yearValue) <= parseInt(range.to)
        );
      default:
        return allData;
    }
  }, [activeFilter, dayRange, weekRange, monthRange, yearRange]);

  const latestData = chartData[chartData.length - 1] || ALL_DATA.month[11];
  const previousData = chartData[chartData.length - 2] || chartData[0] || ALL_DATA.month[10];

  const stats = useMemo(() => [
    {
      title: OIL_TYPES.brent.label,
      value: latestData.brent,
      change: calculateChange(latestData.brent, previousData.brent),
      color: OIL_TYPES.brent.color,
      gradient: OIL_TYPES.brent.gradient,
    },
    {
      title: OIL_TYPES.arjuna.label,
      value: latestData.arjuna,
      change: calculateChange(latestData.arjuna, previousData.arjuna),
      color: OIL_TYPES.arjuna.color,
      gradient: OIL_TYPES.arjuna.gradient,
    },
  ], [latestData, previousData]);

  const getPeriodLabel = () => {
    const range = getCurrentRange();
    
    switch (activeFilter) {
      case 'day':
        return `${formatDate(range.from)} - ${formatDate(range.to)}`;
      case 'week':
        const fromWeek = ALL_DATA.week.find(w => w.weekNumber === range.from);
        const toWeek = ALL_DATA.week.find(w => w.weekNumber === range.to);
        return `${fromWeek?.fullLabel} - ${toWeek?.fullLabel}`;
      case 'month':
        return `${MONTHS[range.from]} - ${MONTHS[range.to]} 2025`;
      case 'year':
        return `${range.from} - ${range.to}`;
      default:
        return 'Semua Data';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
              <FaChartLine className="text-white w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Harga Minyak Dunia</h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Pantau perkembangan harga minyak mentah Brent dan Arjuna secara real-time
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Chart Container */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            {/* Period Filter */}
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

            {/* Calendar Filter Button */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg"
            >
              <FaCalendarAlt className="w-4 h-4" />
              <span>Filter Periode</span>
            </button>
          </div>

          {/* Period Info */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-100">
            <p className="text-sm font-medium text-blue-900">
              📅 Periode: <span className="font-bold">{getPeriodLabel()}</span>
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Menampilkan {chartData.length} data periode
            </p>
          </div>

          {/* Chart */}
          <div className="h-[450px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBrent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={OIL_TYPES.brent.color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={OIL_TYPES.brent.color} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorArjuna" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={OIL_TYPES.arjuna.color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={OIL_TYPES.arjuna.color} stopOpacity={0} />
                  </linearGradient>
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
                  axisLine={{ stroke: '#d1d5db' }}
                  domain={['dataMin - 5', 'dataMax + 5']}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }} 
                  iconType="circle"
                  formatter={(value) => <span className="font-semibold text-gray-700">{value}</span>}
                />
                <Area
                  type="monotone"
                  dataKey="brent"
                  name={OIL_TYPES.brent.label}
                  stroke={OIL_TYPES.brent.color}
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorBrent)"
                  dot={{ fill: OIL_TYPES.brent.color, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: OIL_TYPES.brent.color, strokeWidth: 3 }}
                />
                <Area
                  type="monotone"
                  dataKey="arjuna"
                  name={OIL_TYPES.arjuna.label}
                  stroke={OIL_TYPES.arjuna.color}
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorArjuna)"
                  dot={{ fill: OIL_TYPES.arjuna.color, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: OIL_TYPES.arjuna.color, strokeWidth: 3 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Footer Info */}
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

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filterType={activeFilter}
        rangeFrom={getCurrentRange().from}
        rangeTo={getCurrentRange().to}
        onApply={handleApplyFilter}
      />

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default HargaMinyak;