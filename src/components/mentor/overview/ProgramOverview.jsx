import { useAuth } from '@/contexts/AuthContext';
import { BASE_URL } from '@/utils/apiEndpoint';
import { useEffect, useState } from 'react';
import { Button, Card, Badge, ProgressBar } from 'react-bootstrap';
import { 
  FaUsers, FaCalendarAlt, FaMapMarkerAlt, FaTag, FaClock, 
  FaChartLine, FaUserGraduate, FaCheckCircle, FaHourglassHalf,
  FaArrowRight, FaEnvelope, FaPhone, FaUserCircle, FaFileAlt
} from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';

export default function ProgramOverview() {
  const navigate = useNavigate();
  const { programId } = useParams();
  const { user } = useAuth();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && programId) {
      const p = user?.assignedPrograms?.find(p => p.id === parseInt(programId)) || {};
      setProgram(p);
      setLoading(false);
    }
  }, [programId, user]);

  if (loading) {
    return (
      <div className="flex-1 bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-400 text-sm">Loading program details...</p>
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="flex-1 bg-gray-50 p-6">
        <div className="text-center py-8">
          <p className="text-gray-500">Program not found</p>
          <Button variant="outline-secondary" size="sm" onClick={() => navigate('/user/mentor')}>
            Back to Programs
          </Button>
        </div>
      </div>
    );
  }

  const enrolledCount = program?.enrollmentData?.length || 0;
  const capacityPercentage = (enrolledCount / program?.capacity) * 100;
  
  const stats = [
    { label: "Enrolled Interns", value: enrolledCount, icon: <FaUserGraduate />, max: program?.capacity, color: "gray" },
    { label: "Program Capacity", value: program?.capacity, icon: <FaUsers />, color: "gray" },
    { label: "Completion Rate", value: "0%", icon: <FaChartLine />, color: "gray" },
    { label: "Reports Submitted", value: "0", icon: <FaFileAlt />, color: "gray" },
  ];

  const getStatusBadge = (status) => {
    const statusMap = {
      'NOT_STARTED': { text: 'Not Started', bg: 'secondary' },
      'IN_PROGRESS': { text: 'In Progress', bg: 'primary' },
      'COMPLETED': { text: 'Completed', bg: 'success' },
    };
    const s = statusMap[status] || statusMap.NOT_STARTED;
    return <Badge bg={s.bg} className="px-2 py-1">{s.text}</Badge>;
  };

  return (
    <div className="h-screen  flex-1 bg-gray-50 overflow-y-auto">
      <div className="mx-auto py-6 px-4">
        {/* Header with Banner */}
        <div className="mb-6">
  
          <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
            {program?.imageUrl && (
              <div className="h-[250px] bg-gray-200 bg-cover bg-center" style={{ backgroundImage: `url(${BASE_URL+program.imageUrl})` }} />
            )}
            <div className="p-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-xl font-semibold text-gray-800">{program?.name}</h2>
                    {getStatusBadge(program?.status)}
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <FaTag size={12} /> {program?.type} • {program?.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaCalendarAlt size={12} /> {program?.startDate?.split('T')[0]} - {program?.endDate?.split('T')[0]}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaMapMarkerAlt size={12} /> {program?.location}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 mb-4" dangerouslySetInnerHTML={{ __html: program?.description || '' }} />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-lg border border-gray-100 p-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-gray-400 text-xs uppercase tracking-wide">{stat.label}</p>
                <span className="text-gray-400 text-sm">{stat.icon}</span>
              </div>
              <p className="text-2xl font-semibold text-gray-800 mb-0">
                {stat.value}
                {stat.max && <span className="text-sm text-gray-400 font-normal"> / {stat.max}</span>}
              </p>
            </div>
          ))}
        </div>

        {/* Interns Section */}
        <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-800 mb-0.5">Enrolled Interns</h4>
                <p className="text-xs text-gray-400">Manage and evaluate intern progress</p>
              </div>
              <Button 
                variant="outline-secondary" 
                size="sm"
                onClick={() => navigate('interns')}
                className="flex items-center gap-1"
              >
                View All <FaArrowRight size={12} />
              </Button>
            </div>
          </div>
          
          <div className="divide-y divide-gray-50">
            {program?.enrollmentData?.slice(0, 5).map((intern) => (
              <div 
                key={intern.id} 
                className="px-5 py-3 hover:bg-gray-50 cursor-pointer transition"
                onClick={() => navigate(`interns/${intern.id}`, { state: { intern } })}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <FaUserCircle className="text-gray-400" />
                    </div>
                    <div>
                      <h6 className="font-medium text-gray-800 text-sm mb-0.5">
                        {intern.firstname} {intern.lastname}
                      </h6>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <FaEnvelope size={10} /> {intern.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaCalendarAlt size={10} /> Enrolled: {intern.enrollmentDate?.split('T')[0]}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">
                      {intern.reports?.length || 0} reports
                    </span>
                    <FaArrowRight size={12} className="text-gray-300" />
                  </div>
                </div>
              </div>
            ))}
            
            {program?.enrollmentData?.length === 0 && (
              <div className="px-5 py-8 text-center">
                <FaUsers className="text-gray-300 text-3xl mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No interns enrolled yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          <div 
            className="bg-white rounded-lg border border-gray-100 p-3 text-center hover:border-gray-200 transition cursor-pointer"
            onClick={() => navigate('interns')}
          >
            <FaUserGraduate className="text-gray-400 text-xl mx-auto mb-1" />
            <p className="text-xs font-medium text-gray-700 mb-0">Manage Interns</p>
          </div>
          <div 
            className="bg-white rounded-lg border border-gray-100 p-3 text-center hover:border-gray-200 transition cursor-pointer"
            onClick={() => navigate('reports')}
          >
            <FaFileAlt className="text-gray-400 text-xl mx-auto mb-1" />
            <p className="text-xs font-medium text-gray-700 mb-0">All Reports</p>
          </div>
          <div 
            className="bg-white rounded-lg border border-gray-100 p-3 text-center hover:border-gray-200 transition cursor-pointer"
            onClick={() => navigate('progress')}
          >
            <FaChartLine className="text-gray-400 text-xl mx-auto mb-1" />
            <p className="text-xs font-medium text-gray-700 mb-0">Progress</p>
          </div>
        </div>
      </div>
    </div>
  );
}