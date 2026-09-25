import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Award,
  MapPin,
  Users,
  Target,
  Heart,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

const values = [
  { icon: Award, title: 'Quality', description: 'We are committed to delivering structured and relevant training.' },
  { icon: ShieldCheck, title: 'Integrity', description: 'We operate professionally and transparently.' },
  { icon: Heart, title: 'Empowerment', description: 'We believe skills should create opportunities.' },
  { icon: Users, title: 'Partnership', description: 'We work collaboratively with businesses and stakeholders.' },
  { icon: Target, title: 'Impact', description: 'Meaningful development — not training for the sake of training.' },
];

const milestones = [
  { year: 'Planning', title: 'Every programme begins with careful design' },
  { year: 'Recruitment', title: 'We find the right learners for the right roles' },
  { year: 'Training', title: 'Structured learning with qualified facilitators' },
  { year: 'Workplace', title: 'Real experience in real work environments' },
  { year: 'Assessment', title: 'Competence-based evaluation against NQF standards' },
  { year: 'Completion', title: 'Certification and career readiness' },
];

export default function About() {
  return (
    <div>
      {/* Page header */}
      <section className="bg-gradient-to-b from-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <span className="inline-block text-xs font-bold text-[#E30613] tracking-[0.2em] uppercase mb-3">
            About us
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-4 max-w-3xl">
            Your National Skills Development Partner
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
            B and T Skills Development Trainings is a South African skills development
            organisation focused on helping businesses develop people while creating
            meaningful learning opportunities.
          </p>
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <div className="bg-white border border-slate-200 rounded-xl p-8">
            <div className="text-xs font-bold text-[#E30613] tracking-[0.2em] uppercase mb-3">
              Our vision
            </div>
            <p className="text-lg text-slate-700 leading-relaxed">
              To become a leading national skills development partner recognised for
              quality training, meaningful learner development and practical workplace
              solutions.
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-8">
            <div className="text-xs font-bold text-[#E30613] tracking-[0.2em] uppercase mb-3">
              Our mission
            </div>
            <p className="text-lg text-slate-700 leading-relaxed">
              To develop people, support businesses and create opportunities through
              accessible, practical and quality-driven skills development programmes.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">
            Our values
          </h2>
          <p className="text-slate-600 mb-8 max-w-2xl">
            The principles that guide how we work with learners, employers and partners.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-white border border-slate-200 rounded-xl p-6 hover:border-[#E30613] transition-colors"
              >
                <div className="w-11 h-11 bg-[#E30613]/10 rounded-lg flex items-center justify-center mb-4">
                  <v.icon size={20} className="text-[#E30613]" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{v.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Approach */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">
            Our approach
          </h2>
          <p className="text-slate-600 mb-10 max-w-2xl">
            We focus on the complete training journey, not just the training day.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {milestones.map((m, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-9 h-9 shrink-0 rounded-full bg-[#E30613] text-white flex items-center justify-center text-xs font-bold">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    {m.year}
                  </div>
                  <div className="text-sm font-medium text-slate-800 leading-relaxed">
                    {m.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: ShieldCheck, label: 'QCTO', sub: 'Aligned' },
              { icon: Award, label: 'SAQA', sub: 'Registered' },
              { icon: CheckCircle2, label: 'B-BBEE', sub: 'Compliant' },
              { icon: MapPin, label: '9 Provinces', sub: 'Footprint' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <item.icon size={24} className="text-[#E30613] mx-auto mb-2" />
                <div className="text-sm font-bold text-slate-900">{item.label}</div>
                <div className="text-xs text-slate-500">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="bg-slate-900 rounded-2xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Ready to develop your people?
            </h2>
            <p className="text-slate-400">
              Talk to us about learnerships, occupational training or a national training project.
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-[#E30613] hover:bg-[#c00511] text-white font-semibold px-6 py-3 rounded-lg transition-colors shrink-0"
          >
            Get in touch <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}