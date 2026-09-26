import React, { useState } from 'react';
import { FileText, ExternalLink, Download, Search } from 'lucide-react';

const resources = [
  { id: 1, title: 'Learner Handbook 2026', category: 'Handbook', type: 'PDF', size: '2.4 MB' },
  { id: 2, title: 'Assessment Guidelines', category: 'Assessment', type: 'PDF', size: '1.1 MB' },
  { id: 3, title: 'Portfolio of Evidence Template', category: 'Templates', type: 'DOCX', size: '340 KB' },
  { id: 4, title: 'POPI Act Compliance', category: 'Legal', type: 'PDF', size: '820 KB' },
  { id: 5, title: 'Learner Code of Conduct', category: 'Handbook', type: 'PDF', size: '640 KB' },
  { id: 6, title: 'Workplace Logbook Template', category: 'Templates', type: 'XLSX', size: '180 KB' },
  { id: 7, title: 'Appeal & Grievance Policy', category: 'Legal', type: 'PDF', size: '520 KB' },
  { id: 8, title: 'Facilitator Contact List', category: 'Directory', type: 'PDF', size: '260 KB' },
  { id: 9, title: 'Learner Support Guide', category: 'Handbook', type: 'PDF', size: '1.8 MB' },
  { id: 10, title: 'Assessment Appeal Form', category: 'Templates', type: 'DOCX', size: '95 KB' },
];

const categories = ['all', 'Handbook', 'Assessment', 'Templates', 'Legal', 'Directory'];

export default function Resources() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = resources.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || r.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      {/* Page header */}
      <section className="bg-gradient-to-b from-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <span className="inline-block text-xs font-bold text-[#E30613] tracking-[0.2em] uppercase mb-3">
            Downloads
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-4">
            Resources
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
            Documents, guides and templates for learners, facilitators and employers.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search resources"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:border-slate-900 outline-none transition-colors"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  filter === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-300 text-slate-700 hover:border-slate-400'
                }`}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-xl">
            <FileText size={32} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No resources match your search.</p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
            {filtered.map((r) => (
              <a
                key={r.id}
                href="#"
                className="group no-underline flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors"
              >
                <div className="w-12 h-12 bg-slate-50 group-hover:bg-[#E30613]/10 rounded-lg flex items-center justify-center text-[10px] font-bold text-slate-600 group-hover:text-[#E30613] shrink-0 transition-colors">
                  {r.type}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-slate-900 group-hover:text-[#E30613] leading-snug truncate transition-colors">
                    {r.title}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {r.category} · {r.size}
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-3 text-slate-400 group-hover:text-[#E30613] shrink-0 transition-colors">
                  <Download size={16} />
                  <ExternalLink size={14} />
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Help CTA */}
        <div className="mt-12 bg-white border border-slate-200 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Can't find a document?
            </h3>
            <p className="text-sm text-slate-500">
              Contact our support team and we'll send it to you.
            </p>
          </div>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#E30613] hover:bg-[#c00511] text-white font-semibold px-6 py-3 rounded-lg transition-colors shrink-0"
          >
            Get support
          </a>
        </div>
      </section>
    </div>
  );
}