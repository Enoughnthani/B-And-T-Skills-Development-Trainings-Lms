import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Calendar,
  ExternalLink,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  FileText,
  ShieldCheck,
  Award,
} from 'lucide-react';
import Footer from '../footer/Footer';
import Header from '../header/Header';

// ============================================================
// DATA
// ============================================================
const announcements = [
  { id: 1, date: '03.17', title: 'New Learnership Intake — Gauteng', isNew: true },
  { id: 2, date: '04.04', title: 'Assessment Schedule — April 2026', isNew: true },
  { id: 3, date: '12.09', title: 'End of Year Closure Dates', isNew: false },
  { id: 4, date: '11.24', title: 'Level 4 Combined Class Re-write Dates', isNew: false },
  { id: 5, date: '09.29', title: 'Campus Closure — 1 October 2026', isNew: false },
];

const programmes = [
  { id: 1, title: 'Business Administration', level: 'NQF 4', duration: '12 months' },
  { id: 2, title: 'Project Management', level: 'NQF 4', duration: '12 months' },
  { id: 3, title: 'Generic Management', level: 'NQF 4', duration: '12 months' },
  { id: 4, title: 'Occupational Certificate: Business Administrator', level: 'NQF 4', duration: '12 months' },
];

const resources = [
  { id: 1, title: 'Learner Handbook 2026', type: 'PDF' },
  { id: 2, title: 'Assessment Guidelines', type: 'PDF' },
  { id: 3, title: 'Portfolio of Evidence Template', type: 'DOCX' },
  { id: 4, title: 'POPI Act Compliance', type: 'PDF' },
];


export default function Home() {
  return (
    <div className="bg-white">

      <section className="bg-gradient-to-b from-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl">
            <span className="inline-block text-xs font-bold text-muted tracking-[0.2em] uppercase mb-4">
              National Skills Development
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-zinc-800 leading-[1.1] tracking-tight mb-6">
              Skills Development That{' '}
              <span className="text-[#E30613]">Changes Lives</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-8 max-w-2xl">
              National learnerships, occupational training and workplace learning across South Africa — designed for real outcomes.
            </p>

            <div className="flex flex-wrap gap-3 mb-12">
              <Link
                to="/programmes"
                className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-[#c00511] text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                View Programmes
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-white border border-slate-300 hover:border-slate-400 text-slate-800 font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Contact Us
              </Link>
            </div>

            {/* Trust row */}
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-8 border-t border-slate-200">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <ShieldCheck size={16} className="text-[#E30613] shrink-0" />
                QCTO &amp; SAQA Aligned
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Award size={16} className="text-[#E30613] shrink-0" />
                B-BBEE Recognised
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin size={16} className="text-[#E30613] shrink-0" />
                National Footprint
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          MAIN GRID — Programmes + Announcements
          ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid lg:grid-cols-3 gap-10">

          {/* Programmes — left */}
          <div className="lg:col-span-2">
            <div className="flex items-end justify-between mb-6">
              <h2 className="text-2xl font-extrabold text-zinc-900">
                Our Programmes
              </h2>
              <Link
                to="/programmes"
                className="text-sm font-bold text-[#E30613] no-underline "
              >
                View all
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {programmes.map((p) => (
                <Link
                  key={p.id}
                  to={`/programmes/${p.id}`}
                  className="group flex no-underline  items-start gap-3 p-4 bg-white border border-zinc-200 rounded-lg hover:border-[#E30613] hover:shadow-sm transition-all"
                >
                  <div className="w-10 h-10 bg-zinc-50 group-hover:bg-[#E30613]/10 rounded-lg flex items-center justify-center shrink-0 transition-colors">
                    <BookOpen
                      size={20}
                      className="text-zinc-600 group-hover:text-[#E30613] transition-colors"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-zinc-900 group-hover:text-[#E30613] leading-snug mb-1 transition-colors">
                      {p.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                      <span className="bg-zinc-100 px-2 py-0.5 rounded font-medium">
                        {p.level}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={11} />
                        {p.duration}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Announcements — right */}
          <div>
            <div className="flex items-end justify-between mb-6">
              <h2 className="text-2xl font-extrabold text-zinc-900">
                Announcements
              </h2>
            </div>

            <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
              {announcements.map((item, i) => (
                <Link
                  key={item.id}
                  to={`/announcements/${item.id}`}
                  className={`flex items-start no-underline  gap-3 px-4 py-3 hover:bg-zinc-50 transition-colors group ${i !== announcements.length - 1 ? 'border-b border-zinc-100' : ''
                    }`}
                >
                  <span className="text-xs font-mono text-zinc-400 shrink-0 w-10 pt-0.5">
                    {item.date}
                  </span>
                  <span className="text-sm text-zinc-700 group-hover:text-[#E30613] leading-snug transition-colors">
                    {item.title}
                    {item.isNew && (
                      <span className="ml-2 text-[10px] font-bold text-[#E30613] bg-red-50 px-1.5 py-0.5 rounded">
                        NEW
                      </span>
                    )}
                  </span>
                </Link>
              ))}

              <Link
                to="/announcements"
                className="block text-center py-3 text-sm font-bold text-[#E30613] hover:bg-red-50 border-t border-zinc-100 transition-colors"
              >
                More announcements →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          RESOURCES
          ============================================================ */}
      <section className="bg-zinc-50 border-y border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-2xl font-extrabold text-zinc-900">
              Resources
            </h2>
            <Link
              to="/resources"
              className="text-sm no-underline  font-bold text-[#E30613]"
            >
              View all
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {resources.map((r) => (
              <a
                key={r.id}
                href="#"
                className="group no-underline  flex items-center gap-3 p-4 bg-white border border-zinc-200 rounded-lg hover:border-[#E30613] hover:shadow-sm transition-all"
              >
                <div className="w-10 h-10 bg-zinc-100 group-hover:bg-[#E30613]/10 rounded flex items-center justify-center text-[10px] font-bold text-zinc-600 group-hover:text-[#E30613] shrink-0 transition-colors">
                  {r.type}
                </div>
                <span className="text-sm font-medium text-zinc-800 group-hover:text-[#E30613] flex-1 truncate transition-colors">
                  {r.title}
                </span>
                <ExternalLink
                  size={14}
                  className="text-zinc-400 group-hover:text-[#E30613] shrink-0 transition-colors"
                />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          CONTACT
          ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900 mb-3">
              Get in touch
            </h2>
            <p className="text-zinc-600 mb-6 leading-relaxed">
              Ready to develop your people? Our team will help you structure the right training solution.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center no-underline  gap-2 bg-[#E30613] hover:bg-[#c00511] text-white font-bold px-6 py-3 rounded-md transition-colors"
            >
              Send Enquiry <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <a
              href="tel:0120041175"
              className="flex items-start gap-3 p-4 bg-white no-underline  border border-zinc-200 rounded-lg hover:border-[#E30613] transition-colors group"
            >
              <div className="w-10 h-10 bg-zinc-50 group-hover:bg-[#E30613]/10 rounded-lg flex items-center justify-center shrink-0 transition-colors">
                <Phone size={16} className="text-[#E30613]" />
              </div>
              <div className="min-w-0">
                <div className="text-xs text-zinc-500">Telephone</div>
                <div className="font-bold text-zinc-900 text-sm group-hover:text-[#E30613] transition-colors">
                  012 004 1175
                </div>
              </div>
            </a>

            <a
              href="https://wa.me/27785134511"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 p-4 bg-white no-underline  border border-zinc-200 rounded-lg hover:border-green-600 transition-colors group"
            >
              <div className="w-10 h-10 bg-zinc-50 group-hover:bg-green-50 rounded-lg flex items-center justify-center shrink-0 transition-colors">
                <MessageCircle size={16} className="text-green-600" />
              </div>
              <div className="min-w-0">
                <div className="text-xs text-zinc-500">WhatsApp</div>
                <div className="font-bold text-zinc-900 text-sm group-hover:text-green-600 transition-colors">
                  078 513 45 11
                </div>
              </div>
            </a>

            <a
              href="mailto:info@btsdtrainings.co.za"
              className="flex items-start gap-3 p-4 no-underline  bg-white border border-zinc-200 rounded-lg hover:border-[#E30613] transition-colors group sm:col-span-2"
            >
              <div className="w-10 h-10 bg-zinc-50 group-hover:bg-[#E30613]/10 rounded-lg flex items-center justify-center shrink-0 transition-colors">
                <Mail size={16} className="text-[#E30613]" />
              </div>
              <div className="min-w-0">
                <div className="text-xs text-zinc-500">Email</div>
                <div className="font-bold text-zinc-900 text-sm group-hover:text-[#E30613] truncate transition-colors">
                  info@btsdtrainings.co.za
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}