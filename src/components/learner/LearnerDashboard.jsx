import React, { useEffect, useState } from 'react';
import LogoImage from '../common/LogoImage';
import { Badge, Button } from 'react-bootstrap';
import { Bell, LogOut, Search, Settings, User2, Star, Clock, BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const LearnerDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [program, setProgram] = useState(null)
  const [unitStandards, setUnitStandards] = useState([])

  useEffect(() => {
    setProgram(user?.enrolledProgram)
    setUnitStandards(user?.enrolledProgram?.unitStandards || [])
  }, [user])

  // Default image for unit standards without image
  const getUnitImage = (unit) => {
    const images = {
      'CORE': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=240&fit=crop',
      'FUNDAMENTAL': 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=240&fit=crop',
      'ELECTIVE': 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=240&fit=crop'
    }
    return images[unit.type] || images['CORE']
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="mx-auto">
          <div className="flex mx-4 justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <LogoImage />
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center bg-slate-100 rounded-lg px-3 py-2 border border-slate-200 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
                <Search className="w-4 h-4 text-slate-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm w-48 placeholder:text-slate-400 text-slate-700"
                />
              </div>

              <button className="relative p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <Badge
                  pill
                  bg="primary"
                  className="absolute top-1 right-1 text-[10px] px-1.5 py-0.5 min-w-[18px]"
                >
                  0
                </Badge>
              </button>

              <div>
                <div
                  onClick={() => navigate('profile')}
                  className="flex items-center justify-center border relative rounded-pill p-1 cursor-pointer"
                >
                  <User2 size={16} />
                  <Settings size={13} className="absolute bottom-0 -right-1" />
                </div>
              </div>

              <Button
                variant="outline-danger"
                onClick={logout}
                className="flex items-center gap-2 rounded-lg px-3 py-2 border-slate-300 text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all font-medium text-sm"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div>
          <div className='bg-white mb-4 p-3 rounded-lg border border-slate-100 shadow-sm'>
            <h4 className='text-black font-bold'>Learner Dashboard</h4>
            <p className='m-0 text-slate-500'>Welcome {user?.firstname} {user?.lastname}</p>
            {program && (
              <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">
                <span>📚 {program.name}</span>
                <span>•</span>
                <span>{program.type} • {program.category}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">My Unit Standards</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {unitStandards.map((unitStandard) => (
              <div
                onClick={() => navigate(`unit-standard/${unitStandard.unitStandardId}`, { state: { unitStandard } })}
                key={unitStandard.unitStandardId}
                className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden hover:-translate-y-1"
              >
                <div className="relative h-48 overflow-hidden bg-slate-200">
                  <img
                    src={getUnitImage(unitStandard)}
                    alt={unitStandard.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 shadow-sm">
                    {unitStandard.type}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-white text-xs">
                    📚 {unitStandard.contentCount || 0} resources
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      ID: {unitStandard.unitStandardId}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-1">{unitStandard.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">{unitStandard.description || "No description available"}</p>

                  <div className="mt-4 flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Star size={12} className="text-amber-400" />
                      {unitStandard.credits} credits
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen size={12} />
                      {unitStandard.nqfLevel}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {unitStandard.contentCount || 0} items
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className={`text-xs px-2 py-1 rounded-full ${unitStandard.type === 'CORE' ? 'bg-green-100 text-green-700' :
                        unitStandard.type === 'FUNDAMENTAL' ? 'bg-blue-100 text-blue-700' :
                          'bg-purple-100 text-purple-700'
                      }`}>
                      {unitStandard.type}
                    </div>
                    <div className="text-xs font-medium text-slate-400 group-hover:text-slate-600 transition-colors">
                      Click to start →
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {unitStandards.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <p className="text-slate-500">You are not enrolled in any learnerships yet.</p>
              <button className="mt-3 text-sm font-medium text-slate-600 hover:text-slate-800 underline">Browse Courses</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};