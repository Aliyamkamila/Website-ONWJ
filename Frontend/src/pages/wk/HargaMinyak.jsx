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
import { FaChartLine, FaOilCan, FaArrowUp, FaArrowDown, FaFilter, FaTimes } from 'react-icons/fa';

// ========== CONSTANTS ==========
const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November',
];

const FILTER_OPTIONS = [
  { id: 'week', label: 'Mingguan', icon: '📅' },
  { id: 'month', label: 'Bulanan', icon: '📆' },
  { id: 'year', label: 'Tahunan', icon: '📊' },
];

const OIL_TYPES = [
  { id: 'all', label: 'Semua' },
  { id: 'brent', label: 'Brent', color: '#2563eb' },
  { id: 'wti', label: 'WTI', color: '#059669' },
  { id: 'icp', label: 'ICP', color: '#d97706' },
];

const CHART_COLORS = {
  brent: '#2563eb',
  wti: '#059669',
  icp: '#d97706',
};

const YEARS = ['2021', '2022', '2023', '2024', '2025'];

// ========== DATA GENERATION ==========
const generateWeeklyData = () => {
  const data = [];
  let weekCount = 1;

  MONTHS.forEach((month, monthIndex) => {
    const weeksInMonth = monthIndex === 1 ? 4 : monthIndex % 2 === 0 ? 5 : 4;
    
    for (let week = 1; week <= weeksInMonth; week++) {
      const basePrice = 75 + Math.sin(weekCount * 0.3) * 10 + Math.random() * 5;
      
      data.push({
        id: weekCount,
        weekNumber: weekCount,
        monthIndex: monthIndex,
        monthName: month,
        label: `W${week} ${month. substring(0, 3)}`,
        fullLabel: `Minggu ${week}, ${month} 2025`,
        brent: parseFloat((basePrice + Math.random() * 3).toFixed(2)),
        wti: parseFloat((basePrice - 3 + Math.random() * 2).toFixed(2)),
        icp: parseFloat((basePrice - 1 + Math.random() * 2.5).toFixed(2)),
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
      id: index + 1,
      monthIndex: index,
      label: month. substring(0, 3),
      fullLabel: `${month} 2025`,
      brent: parseFloat((basePrice + 5 + Math.random() * 3).toFixed(2)),
      wti: parseFloat((basePrice + 2 + Math.random() * 2).toFixed(2)),
      icp: parseFloat((basePrice + 3 + Math.random() * 2.5).toFixed(2)),
    };
  });
};

const generateYearlyData = () => {
  return YEARS. map((year, index) => {
    const basePrice = 60 + index * 5 + Math.random() * 10;
    
    return {
      id: index + 1,
      yearIndex: index,
      label: year,
      fullLabel: `Tahun ${year}`,
      brent: parseFloat((basePrice + 8 + Math.random() * 5).toFixed(2)),
      wti: parseFloat((basePrice + 5 + Math.random() * 4).toFixed(2)),
      icp: parseFloat((basePrice + 6 + Math.random() * 4).toFixed(2)),
    };
  });
};

// Generate data once
const ALL_DATA = {
  week: generateWeeklyData(),
  month: generateMonthlyData(),
  year: generateYearlyData(),
};

// ========== UTILITY FUNCTIONS ==========
const calculateChange = (current, previous) => 
  ((current - previous) / previous) * 100;

// ========== SUB-COMPONENTS ==========
const CustomTooltip = ({ active, payload, label }) => {
  if (! active || !payload?. length) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
      <p className="font-semibold text-gray-800 mb-2">
        {payload[0]?.payload?.fullLabel || label}
      </p>
      {payload. map((entry, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-600">{entry.name}:</span>
          <span className="font-semibold" style={{ color: entry.color }}>
            ${entry.value} /bbl
          </span>
        </div>
      ))}
    </div>
  );
};

const StatsCard = ({ title, value, change, icon: Icon, color }) => {
  const isPositive = change >= 0;

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          {isPositive ? <FaArrowUp className="w-3 h-3" /> : <FaArrowDown className="w-3 h-3" />}
          {Math.abs(change).toFixed(2)}%
        </div>
      </div>
      <h4 className="text-sm text-gray-500 mb-1">{title}</h4>
      <p className="text-2xl font-bold text-gray-900">
        ${value}{' '}
        <span className="text-sm font-normal text-gray-500">/bbl</span>
      </p>
    </div>
  );
};

const FilterButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
      active
        ? 'bg-blue-600 text-white shadow-md'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`}
  >
    <span>{icon}</span>
    <span>{label}</span>
  </button>
);

const OilTypeButton = ({ active, onClick, label, color }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
      active
        ? 'text-white'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`}
    style={active && color ? { backgroundColor: color } : {}}
  >
    {label}
  </button>
);

const ChartGradients = () => (
  <defs>
    {Object.entries(CHART_COLORS).map(([key, color]) => (
      <linearGradient key={key} id={`color${key. charAt(0).toUpperCase() + key.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor={color} stopOpacity={0.3} />
        <stop offset="95%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    ))}
  </defs>
);

// ========== FILTER MODAL ==========
const FilterModal = ({ isOpen, onClose, filterType, rangeFrom, rangeTo, onApply }) => {
  const [tempFrom, setTempFrom] = useState(rangeFrom);
  const [tempTo, setTempTo] = useState(rangeTo);

  if (!isOpen) return null;

  const getOptions = () => {
    switch (filterType) {
      case 'week':
        return ALL_DATA.week. map((item) => ({
          value: item.weekNumber,
          label: item.fullLabel,
        }));
      case 'month':
        return MONTHS.map((month, index) => ({
          value: index,
          label: month,
        }));
      case 'year':
        return YEARS.map((year, index) => ({
          value: index,
          label: year,
        }));
      default:
        return [];
    }
  };

  const options = getOptions();

  const handleApply = () => {
    onApply(tempFrom, tempTo);
    onClose();
  };

  const getLabel = () => {
    switch (filterType) {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FaFilter className="text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">Filter Periode {getLabel()}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Inputs */}
        <div className="space-y-4 mb-6">
          {/* From */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dari {getLabel()}
            </label>
            <select
              value={tempFrom}
              onChange={(e) => {
                const val = parseInt(e.target. value);
                setTempFrom(val);
                if (val > tempTo) setTempTo(val);
              }}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {options. map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sampai {getLabel()}
            </label>
            <select
              value={tempTo}
              onChange={(e) => setTempTo(parseInt(e. target.value))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {options.map((opt) => (
                <option key={opt.value} value={opt.value} disabled={opt.value < tempFrom}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
          <p className="text-sm text-blue-800">
            📊 Menampilkan <span className="font-bold">{tempTo - tempFrom + 1}</span> {getLabel(). toLowerCase()} data
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2. 5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Terapkan Filter
          </button>
        </div>
      </div>
    </div>
  );
};

// ========== MAIN COMPONENT ==========
const HargaMinyak = () => {
  const [activeFilter, setActiveFilter] = useState('month');
  const [selectedOilType, setSelectedOilType] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Range states
  const [weekRange, setWeekRange] = useState({ from: 1, to: 10 });
  const [monthRange, setMonthRange] = useState({ from: 0, to: 10 });
  const [yearRange, setYearRange] = useState({ from: 0, to: 4 });

  // Get current range based on active filter
  const getCurrentRange = () => {
    switch (activeFilter) {
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
          item.yearIndex >= range.from && item.yearIndex <= range.to
        );
      default:
        return allData;
    }
  }, [activeFilter, weekRange, monthRange, yearRange]);

  const latestData = chartData[chartData.length - 1] || ALL_DATA.month[10];
  const previousData = chartData[chartData.length - 2] || chartData[0] || ALL_DATA.month[9];

  const stats = useMemo(() => [
    {
      title: 'Brent Crude',
      value: latestData. brent,
      change: calculateChange(latestData.brent, previousData.brent),
      icon: FaOilCan,
      color: 'bg-blue-600',
    },
    {
      title: 'Arjuna Crude',
      value: latestData.wti,
      change: calculateChange(latestData.wti, previousData.wti),
      icon: FaOilCan,
      color: 'bg-green-600',
    },
    {
      title: 'ICP (Indonesia)',
      value: latestData.icp,
      change: calculateChange(latestData.icp, previousData.icp),
      icon: FaOilCan,
      color: 'bg-amber-600',
    },
  ], [latestData, previousData]);

  const getPeriodLabel = () => {
    const range = getCurrentRange();
    switch (activeFilter) {
      case 'week':
        const fromWeek = ALL_DATA.week. find(w => w.weekNumber === range.from);
        const toWeek = ALL_DATA.week.find(w => w.weekNumber === range.to);
        return `${fromWeek?.fullLabel} - ${toWeek?.fullLabel}`;
      case 'month':
        return `${MONTHS[range.from]} - ${MONTHS[range.to]} 2025`;
      case 'year':
        return `${YEARS[range.from]} - ${YEARS[range.to]}`;
      default:
        return 'Semua Data';
    }
  };

  const renderArea = (dataKey, name, color) => (
    <Area
      key={dataKey}
      type="monotone"
      dataKey={dataKey}
      name={name}
      stroke={color}
      strokeWidth={2}
      fillOpacity={1}
      fill={`url(#color${dataKey.charAt(0).toUpperCase() + dataKey.slice(1)})`}
      dot={{ fill: color, strokeWidth: 2, r: 4 }}
      activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
    />
  );

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-8 lg:px-16">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-3">
            <FaChartLine className="text-blue-600" />
            Harga Minyak Dunia
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Pantau perkembangan harga minyak mentah dunia secara real-time.  Data mencakup Brent Crude, WTI, dan ICP Indonesia.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatsCard key={index} {... stat} />
          ))}
        </div>

        {/* Chart Container */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          {/* Filter Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            {/* Time Filter + Filter Icon */}
            <div className="flex gap-2 flex-wrap items-center">
              {FILTER_OPTIONS.map((filter) => (
                <FilterButton
                  key={filter.id}
                  active={activeFilter === filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  icon={filter.icon}
                  label={filter.label}
                />
              ))}
              
              {/* Filter Icon Button */}
              <button
                onClick={() => setIsFilterOpen(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-md"
                title="Filter Periode"
              >
                <FaFilter className="w-4 h-4" />
                <span>Filter</span>
              </button>
            </div>

            {/* Oil Type Filter */}
            <div className="flex gap-2 flex-wrap">
              {OIL_TYPES.map((type) => (
                <OilTypeButton
                  key={type. id}
                  active={selectedOilType === type.id}
                  onClick={() => setSelectedOilType(type.id)}
                  label={type.label}
                  color={type. color}
                />
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <ChartGradients />
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="label"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickLine={{ stroke: '#e5e7eb' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickLine={{ stroke: '#e5e7eb' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  domain={['dataMin - 5', 'dataMax + 5']}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />

                {(selectedOilType === 'all' || selectedOilType === 'brent') &&
                  renderArea('brent', 'Brent Crude', CHART_COLORS.brent)}
                {(selectedOilType === 'all' || selectedOilType === 'wti') &&
                  renderArea('wti', 'Arjuna Crude', CHART_COLORS. wti)}
                {(selectedOilType === 'all' || selectedOilType === 'icp') &&
                  renderArea('icp', 'ICP Indonesia', CHART_COLORS.icp)}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Chart Info */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="text-sm text-gray-500">
                <span className="font-medium">Periode:</span> {getPeriodLabel()}
              </div>
              <div className="text-sm text-gray-500">
                <span className="font-medium">Sumber:</span> Data Dummy
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
    </div>
  );
};

export default HargaMinyak;