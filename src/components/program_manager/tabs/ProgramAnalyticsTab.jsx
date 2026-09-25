import { FaChartLine, FaGraduationCap, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function ProgramAnalyticsTab({ getEnrollmentPercentage, program }) {
  const navigate = useNavigate();

  const cards = [
    {
      icon: FaChartLine,
      value: `${getEnrollmentPercentage().toFixed(0)}%`,
      label: 'Enrolment rate',
      accent: true,
    },
    {
      icon: FaUsers,
      value: `${program.enrolledCount || 0}/${program.capacity || 0}`,
      label: 'Total enrolled',
    },
    {
      icon: FaGraduationCap,
      value: '0',
      label: 'Completed',
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">
        Programme analytics
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="bg-white border border-zinc-200 rounded-xl p-5"
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                  card.accent ? 'bg-red-50' : 'bg-zinc-100'
                }`}
              >
                <Icon
                  className={card.accent ? 'text-[#E30613]' : 'text-zinc-600'}
                  size={16}
                />
              </div>
              <div
                className={`text-2xl font-extrabold tabular-nums mb-1 ${
                  card.accent ? 'text-[#E30613]' : 'text-zinc-900'
                }`}
              >
                {card.value}
              </div>
              <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                {card.label}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h4 className="font-bold text-zinc-900 mb-1">
            Detailed analytics
          </h4>
          <p className="text-sm text-zinc-500">
            Enrolment trends, completion rates and assessment outcomes over time.
          </p>
        </div>
        <button
          onClick={() =>
            navigate(`/user/program-manager/programmes/analytics/${program.id}`)
          }
          className="inline-flex items-center justify-center gap-2 bg-[#E30613] hover:bg-[#c00511] text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors shrink-0 w-full sm:w-auto"
        >
          <FaChartLine size={12} />
          View full report
        </button>
      </div>

    </div>
  );
}