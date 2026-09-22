import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { FaCalendarAlt, FaEnvelope, FaFileAlt, FaSearch, FaUserCircle } from 'react-icons/fa';
import { useLocation, useNavigate, useParams } from 'react-router-dom';


export default function InternsList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const programId = useParams();
  const location = useLocation();
  const [program, setProgram] = useState(location.state?.program || {});
  const [interns, setInterns] = useState(program?.enrollmentData || []);
  const { user } = useAuth()

  const filteredInterns = interns.filter(intern =>
    intern?.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    intern.email.toLowerCase().includes(searchTerm.toLowerCase())
  );


  useEffect(() => {
    if (interns.length === 0 && user) {
      const p = user?.assignedPrograms?.find(p => p.id === parseInt(programId.programId)) || {};
      setProgram(p);
      setInterns(p?.enrollmentData || []);
    }
  }, [programId, user]);

  return (
    <div className="h-screen flex-1 bg-gray-50 p-3 overflow-y-auto">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-6">
          {program?.name && (
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
              {program.name}
            </h3>
          )}

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Interns
          </h2>

          <p className="text-gray-600 text-base">
            Manage and evaluate intern monthly reports
          </p>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search interns by name or email..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Interns List */}
        {/* Interns List */}
        <div className="space-y-4">
          {filteredInterns.map((intern) => (
            <Card key={intern.id} className="border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl">
              <Card.Body className="p-4">
                <div className="flex justify-between items-center gap-4">
                  {/* Left Section - Intern Info */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <FaUserCircle className="text-gray-400 text-3xl flex-shrink-0 mt-0.5" />

                    <div className="flex-1 min-w-0">
                      <h5 className="font-semibold text-gray-900 text-base mb-1.5 truncate">
                        {intern?.firstname} {intern?.lastname}
                      </h5>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <FaEnvelope className="text-gray-400" size={11} />
                          <span className="truncate">{intern.email}</span>
                        </span>

                        <span className="flex items-center gap-1.5">
                          <FaCalendarAlt className="text-gray-400" size={11} />
                          <span>Enrolled: {intern?.enrollmentDate || 'N/A'}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Action Button */}
                  <div className="flex-shrink-0">
                    <Button
                      size="sm"
                      onClick={() => navigate(`${intern?.id}`, { state: { intern } })}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 shadow-sm hover:shadow"
                    >
                      <FaFileAlt size={14} />
                      Evaluate
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}

          {/* Empty State */}
          {filteredInterns.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
              <FaUserCircle className="text-gray-300 text-6xl mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No interns found</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}