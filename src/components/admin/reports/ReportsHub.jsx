import { Link } from 'react-router-dom';
import {
  FaArrowRight,
  FaCalendarCheck,
  FaClipboardCheck,
  FaGraduationCap,
  FaUsers,
} from 'react-icons/fa';

const REPORTS = [
  {
    key: 'learner-progress',
    title: 'Learner Progress',
    description: 'Track progress, assessments and PoE status across all learners.',
    icon: FaUsers,
    to: '/user/admin/reports/learner-progress',
  },
  {
    key: 'completion',
    title: 'Completion & Certificates',
    description: 'Who has completed their programme and received certification.',
    icon: FaGraduationCap,
    to: '/user/admin/reports/completion',
  },
  {
    key: 'assessment',
    title: 'Assessment Results',
    description: 'Pass rates, competency achievement and resubmissions.',
    icon: FaClipboardCheck,
    to: '/user/admin/reports/assessments',
  },
  {
    key: 'attendance',
    title: 'Attendance',
    description: 'Class attendance records across all programmes and cohorts.',
    icon: FaCalendarCheck,
    to: '/user/admin/reports/attendance',
  },
];

export default function ReportsHub() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 mb-1">
          Reports
        </h1>
        <p className="text-sm text-zinc-500">
          Operational reports for programmes, learners and assessments.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {REPORTS.map((report) => {
          const Icon = report.icon;
          return (
            <Link
              key={report.key}
              to={report.to}
              className="group bg-white border border-zinc-200 rounded-xl p-5 hover:border-[#E30613] hover:shadow-sm transition-all no-underline hover:no-underline"
            >
              <div className="w-11 h-11 bg-zinc-100 group-hover:bg-zinc-900 rounded-lg flex items-center justify-center mb-4 transition-colors">
                <Icon className="text-zinc-700 group-hover:text-white text-xl transition-colors" />
              </div>
              <h3 className="font-bold text-zinc-900 mb-1 group-hover:text-[#E30613] transition-colors no-underline">
                {report.title}
              </h3>
              <p className="text-sm text-zinc-500 mb-4 leading-relaxed">
                {report.description}
              </p>
              <span className="text-sm font-bold text-[#E30613] inline-flex items-center gap-1 no-underline">
                Open report <FaArrowRight size={10} />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}