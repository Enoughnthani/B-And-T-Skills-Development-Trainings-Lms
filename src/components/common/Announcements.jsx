import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, ArrowRight, Filter } from 'lucide-react';

const announcements = [
  { id: 1, date: '2026-03-17', category: 'Intake', title: 'New Learnership Intake — Gauteng', excerpt: 'We are opening 30 places for our Business Administration learnership in Gauteng. Applications close end of April.', isNew: true },
  { id: 2, date: '2026-04-04', category: 'Assessment', title: 'Assessment Schedule — April 2026', excerpt: 'The April assessment schedule is now available. Please check your portal for personal dates and venues.', isNew: true },
  { id: 3, date: '2026-12-09', category: 'Notice', title: 'End of Year Closure Dates', excerpt: 'Our offices and campuses will close on 15 December 2026 and reopen on 6 January 2027.', isNew: false },
  { id: 4, date: '2026-11-24', category: 'Assessment', title: 'Level 4 Combined Class Re-write Dates', excerpt: 'Re-write dates for Level 4 assessments are confirmed for late November and early December 2026.', isNew: false },
  { id: 5, date: '2026-09-29', category: 'Notice', title: 'Campus Closure — 1 October 2026', excerpt: 'Please note campuses will be closed on 1 October 2026 for a public holiday.', isNew: false },
  { id: 6, date: '2026-07-05', category: 'Notice', title: 'Learner POPI Act_2026', excerpt: 'Updated POPI Act documentation is available on the Resources page. All learners must acknowledge.', isNew: false },
  { id: 7, date: '2026-06-21', category: 'Assessment', title: 'Systems Development Level 5 Assessment Dates', excerpt: 'Level 5 Systems Development assessment dates are now confirmed for July 2026.', isNew: false },
  { id: 8, date: '2026-05-12', category: 'Intake', title: 'Project Management Intake — Western Cape', excerpt: 'New Project Management NQF 4 intake for Western Cape learners now open.', isNew: false },
];

const categories = ['all', 'Intake', 'Assessment', 'Notice'];

export default function Announcements() {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all'
    ? announcements
    : announcements.filter((a) => a.category === filter);

  const formatDate = (iso) => {
    const d = new Date(iso);
    const day = d.getDate().toString().padStart(2, '0');
    const month = d.toLocaleString('en-ZA', { month: 'short' });
    return { day, month, year: d.getFullYear() };
  };

  return (
    <div>
      {/* Page header */}
      <section className="bg-gradient-to-b from-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <span className="inline-block text-xs font-bold text-[#E30613] tracking-[0.2em] uppercase mb-3">
            Stay updated
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-4">
            Announcements
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
            Intakes, assessment dates, closures and important notices for learners and employers.
          </p>
        </div>
      </section>

      {/* Filters + list */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          <Filter size={14} className="text-slate-400 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3.5 py-1.5 text-sm font-medium rounded-full transition-colors ${
                filter === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-300 text-slate-700 hover:border-slate-400'
              }`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          {filtered.map((item, i) => {
            const d = formatDate(item.date);
            return (
              <Link
                key={item.id}
                to={`/announcements/${item.id}`}
                className={`group no-underline flex items-start gap-5 px-6 py-5 hover:bg-slate-50 transition-colors ${
                  i !== filtered.length - 1 ? 'border-b border-slate-100' : ''
                }`}
              >
                {/* Date block */}
                <div className="shrink-0 w-14 text-center">
                  <div className="text-2xl font-extrabold text-slate-900 leading-none">
                    {d.day}
                  </div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">
                    {d.month}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {d.year}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-[10px] font-bold text-[#E30613] bg-red-50 px-2 py-0.5 rounded uppercase tracking-wider">
                      {item.category}
                    </span>
                    {item.isNew && (
                      <span className="text-[10px] font-bold text-white bg-[#E30613] px-2 py-0.5 rounded uppercase tracking-wider">
                        New
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#E30613] leading-snug mb-1 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                    {item.excerpt}
                  </p>
                </div>

                <ArrowRight
                  size={16}
                  className="shrink-0 text-slate-300 group-hover:text-[#E30613] group-hover:translate-x-0.5 mt-2 transition-all"
                />
              </Link>
            );
          })}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-xl">
            <Bell size={32} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No announcements in this category.</p>
          </div>
        )}
      </section>
    </div>
  );
}