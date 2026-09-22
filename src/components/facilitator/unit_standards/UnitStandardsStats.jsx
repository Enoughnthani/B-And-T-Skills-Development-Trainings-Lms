import { FaDatabase, FaStar, FaAward, FaCode, FaChartLine } from 'react-icons/fa';

export default function UnitStandardsStats({ stats }) {
  const getPercentage = (value) => stats.total ? `${(value / stats.total) * 100}%` : '0%';

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-500 uppercase">Total Units</p>
          <FaDatabase className="text-gray-400 text-sm" />
        </div>
        <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-blue-600 uppercase">Fundamental</p>
          <FaStar className="text-blue-500 text-sm" />
        </div>
        <p className="text-2xl font-bold text-blue-600">{stats.fundamental}</p>
        <div className="w-full bg-blue-100 rounded-full h-1 mt-2">
          <div className="bg-blue-500 rounded-full h-1" style={{ width: getPercentage(stats.fundamental) }} />
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm border border-green-100">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-green-600 uppercase">Core</p>
          <FaAward className="text-green-500 text-sm" />
        </div>
        <p className="text-2xl font-bold text-green-600">{stats.core}</p>
        <div className="w-full bg-green-100 rounded-full h-1 mt-2">
          <div className="bg-green-500 rounded-full h-1" style={{ width: getPercentage(stats.core) }} />
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm border border-purple-100">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-purple-600 uppercase">Elective</p>
          <FaCode className="text-purple-500 text-sm" />
        </div>
        <p className="text-2xl font-bold text-purple-600">{stats.elective}</p>
        <div className="w-full bg-purple-100 rounded-full h-1 mt-2">
          <div className="bg-purple-500 rounded-full h-1" style={{ width: getPercentage(stats.elective) }} />
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-400 uppercase">Total Credits</p>
          <FaChartLine className="text-gray-400 text-sm" />
        </div>
        <p className="text-2xl font-bold text-white">{stats.totalCredits}</p>
      </div>
    </div>
  );
}