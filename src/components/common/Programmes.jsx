import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Clock,
  Users,
  Award,
  ArrowRight,
  Search,
} from 'lucide-react';

const programmes = [
  {
    id: 1,
    title: 'Business Administration',
    level: 'NQF 4',
    duration: '12 months',
    learners: 45,
    sector: 'Business',
    status: 'open',
    description:
      'Foundational business skills for office and administrative environments. Learners develop competencies in communication, records management and office systems.',
  },
  {
    id: 2,
    title: 'Project Management',
    level: 'NQF 4',
    duration: '12 months',
    learners: 32,
    sector: 'Management',
    status: 'open',
    description:
      'Plan, execute and monitor projects using practical workplace tools. Includes scheduling, budgeting, stakeholder management and reporting.',
  },
  {
    id: 3,
    title: 'Generic Management',
    level: 'NQF 4',
    duration: '12 months',
    learners: 28,
    sector: 'Leadership',
    status: 'open',
    description:
      'Supervisory and team leadership skills for first-line managers. Focus on performance, conflict resolution and workplace communication.',
  },
  {
    id: 4,
    title: 'Occupational Certificate: Business Administrator',
    level: 'NQF 4',
    duration: '12 months',
    learners: 18,
    sector: 'QCTO',
    status: 'open',
    description:
      'Full occupational qualification aligned to QCTO standards. Combines theory, practical work experience and structured assessment.',
  },
  {
    id: 5,
    title: 'Customer Service',
    level: 'NQF 3',
    duration: '10 months',
    learners: 22,
    sector: 'Service',
    status: 'coming-soon',
    description:
      'Develop professional customer service skills for retail, call centre and service environments.',
  },
  {
    id: 6,
    title: 'New Venture Creation',
    level: 'NQF 4',
    duration: '12 months',
    learners: 15,
    sector: 'Entrepreneurship',
    status: 'coming-soon',
    description:
      'For aspiring entrepreneurs — business planning, financial management and marketing fundamentals.',
  },
];

export default function Programmes() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const sectors = ['all', ...new Set(programmes.map((p) => p.sector))];

  const filtered = programmes.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || p.sector === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      {/* Page header */}
      <section className="bg-gradient-to-b from-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <span className="inline-block text-xs font-bold text-[#E30613] tracking-[0.2em] uppercase mb-3">
            What we offer
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-4">
            Our Programmes
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
            Accredited learnerships and occupational qualifications designed around real
            workplace needs.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search programmes"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:border-slate-900 outline-none transition-colors"
            />
          </div>

          {/* Sector filter */}
          <div className="flex flex-wrap gap-2">
            {sectors.map((sector) => (
              <button
                key={sector}
                onClick={() => setFilter(sector)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  filter === sector
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-300 text-slate-700 hover:border-slate-400'
                }`}
              >
                {sector === 'all' ? 'All' : sector}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-xl">
            <BookOpen size={32} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No programmes match your search.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((p) => (
              <Link
                key={p.id}
                to={`/programmes/${p.id}`}
                className="group flex flex-col bg-white border border-slate-200 rounded-xl p-6 hover:border-[#E30613] hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 bg-slate-50 group-hover:bg-[#E30613]/10 rounded-lg flex items-center justify-center transition-colors">
                    <BookOpen
                      size={20}
                      className="text-slate-600 group-hover:text-[#E30613] transition-colors"
                    />
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase tracking-wider">
                      {p.sector}
                    </span>
                    {p.status === 'coming-soon' && (
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded uppercase tracking-wider">
                        Coming soon
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-[#E30613] leading-snug mb-2 transition-colors">
                  {p.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-5 flex-grow line-clamp-3">
                  {p.description}
                </p>

                <div className="flex items-center gap-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Award size={12} />
                    {p.level}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={12} />
                    {p.duration}
                  </span>
                  <span className="flex items-center gap-1.5 ml-auto">
                    <Users size={12} />
                    {p.learners}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 bg-slate-900 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
              Can't find what you're looking for?
            </h3>
            <p className="text-slate-400 text-sm">
              We build custom programmes for employers and funders.
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-[#E30613] hover:bg-[#c00511] text-white font-semibold px-6 py-3 rounded-lg transition-colors shrink-0"
          >
            Talk to us <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}