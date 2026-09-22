import { apiFetch } from '@/api/api';
import { useEffect, useState } from 'react';
import {
  FaEnvelope,
  FaEye,
  FaFilter,
  FaPhone,
  FaSearch,
  FaSortAmountDown,
  FaSpinner,
  FaUserCheck, FaUserFriends,
  FaUserGraduate,
  FaUsers,
  FaVenusMars
} from 'react-icons/fa';
import { useParams } from 'react-router-dom';

export default function EnrolledLearnerView() {
  const { programId } = useParams();
  const [learners, setLearners] = useState([]);
  const [filteredLearners, setFilteredLearners] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);
  const [program, setProgram] = useState({});

  useEffect(() => {
    fetchEnrolledLearners();
  }, [programId]);


  const fetchEnrolledLearners = async () => {
    setLoading(true);
    try {
      const data = await apiFetch(`/api/programs/${programId}/enrollments`);
      setLearners(data?.payload);
      setFilteredLearners(data?.payload);
    } catch (error) {
      console.error('Error fetching enrolled learners:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...learners];
    
    if (searchTerm) {
      result = result.filter(learner => 
        learner.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        learner.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        learner.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterGender !== 'ALL') {
      result = result.filter(learner => learner.gender === filterGender);
    }
    
    if (filterStatus !== 'ALL') {
      result = result.filter(learner => learner.status === filterStatus);
    }
    
    result.sort((a, b) => {
      if (sortBy === 'name') {
        return `${a.firstname} ${a.lastname}`.localeCompare(`${b.firstname} ${b.lastname}`);
      }
      if (sortBy === 'enrollment') {
        return new Date(b.enrollmentDate) - new Date(a.enrollmentDate);
      }
      return 0;
    });
    
    setFilteredLearners(result);
  }, [searchTerm, filterGender, filterStatus, learners, sortBy]);

  const stats = {
    total: learners.length,
    active: learners.filter(l => l.status === 'ACTIVE').length,
    female: learners.filter(l => l.gender === 'Female').length,
    male: learners.filter(l => l.gender === 'Male').length
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center h-screen bg-gray-50">
        <FaSpinner className="text-gray-400 text-3xl animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-screen overflow-y-auto bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <FaUsers className="text-white text-lg" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Enrolled Learners</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {program?.name || 'Program'} • {learners.length} learners enrolled
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                <FaUsers className="text-gray-500 text-lg" />
              </div>
              <span className="text-2xl font-bold text-gray-800">{stats.total}</span>
            </div>
            <p className="text-gray-600 font-medium">Total Learners</p>
            <p className="text-xs text-gray-400 mt-1">enrolled in program</p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-emerald-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                <FaUserCheck className="text-emerald-500 text-lg" />
              </div>
              <span className="text-2xl font-bold text-emerald-600">{stats.active}</span>
            </div>
            <p className="text-gray-600 font-medium">Active</p>
            <p className="text-xs text-gray-400 mt-1">currently active</p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-pink-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center">
                <FaUserFriends className="text-pink-500 text-lg" />
              </div>
              <span className="text-2xl font-bold text-pink-600">{stats.female}</span>
            </div>
            <p className="text-gray-600 font-medium">Female</p>
            <p className="text-xs text-gray-400 mt-1">learners</p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-blue-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <FaUserGraduate className="text-blue-500 text-lg" />
              </div>
              <span className="text-2xl font-bold text-blue-600">{stats.male}</span>
            </div>
            <p className="text-gray-600 font-medium">Male</p>
            <p className="text-xs text-gray-400 mt-1">learners</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            />
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-5 py-3 rounded-xl text-sm font-medium transition flex items-center gap-2 ${
                showFilters 
                  ? 'bg-gray-800 text-white shadow-md' 
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FaFilter size={14} />
              Filters
            </button>
            
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-5 py-3 pr-10 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-blue-400 cursor-pointer appearance-none"
              >
                <option value="name">Sort by Name</option>
                <option value="enrollment">Sort by Enrollment Date</option>
              </select>
              <FaSortAmountDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm" />
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 shadow-sm">
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Gender:</span>
                <div className="flex gap-2">
                  {['ALL', 'Female', 'Male'].map(g => (
                    <button
                      key={g}
                      onClick={() => setFilterGender(g)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                        filterGender === g
                          ? 'bg-gray-800 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {g === 'ALL' ? 'All' : g}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status:</span>
                <div className="flex gap-2">
                  {['ALL', 'ACTIVE', 'INACTIVE'].map(s => (
                    <button
                      key={s}
                      onClick={() => setFilterStatus(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                        filterStatus === s
                          ? s === 'ACTIVE' 
                            ? 'bg-emerald-600 text-white' 
                            : s === 'INACTIVE' 
                              ? 'bg-gray-600 text-white' 
                              : 'bg-gray-800 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Learners Table */}
        {filteredLearners.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUserGraduate className="text-gray-400 text-3xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">No learners found</h3>
            <p className="text-gray-400 text-sm">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Learner</th>
                    <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Gender</th>
                    <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Enrolled</th>
                    <th className="p-4 w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredLearners.map((learner,id) => (
                    <tr key={id} className="hover:bg-gray-50 transition group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-semibold ${
                            learner.gender === 'Female' ? 'bg-pink-500' : 'bg-blue-500'
                          }`}>
                            {learner.firstname?.[0]}{learner.lastname?.[0]}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{learner.firstname} {learner.lastname}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <FaEnvelope size={12} className="text-gray-400" />
                          <span>{learner.email}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <FaPhone size={12} className="text-gray-400" />
                          <span>{learner.contactNumber || '—'}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <FaVenusMars size={12} className={learner.gender === 'Female' ? 'text-pink-400' : 'text-blue-400'} />
                          <span className="text-sm text-gray-600">{learner.gender}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          learner.status === 'ACTIVE' 
                            ? 'bg-emerald-50 text-emerald-700' 
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            learner.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-gray-400'
                          }`} />
                          {learner.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {learner.enrollmentDate ? new Date(learner.enrollmentDate).toLocaleDateString() : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Footer */}
        {filteredLearners.length > 0 && (
          <div className="mt-4 px-2 py-2 text-center">
            <p className="text-xs text-gray-400">
              Showing {filteredLearners.length} of {learners.length} learners
            </p>
          </div>
        )}
      </div>
    </div>
  );
}