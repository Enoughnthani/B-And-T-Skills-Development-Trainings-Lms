export default function ProgramOverviewTab({ program }) {
  function formatDate(dateString) {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  const STATUS_STYLES = {
    ACTIVE: 'bg-zinc-100 text-zinc-700',
    NOT_STARTED: 'bg-zinc-100 text-zinc-600',
    IN_PROGRESS: 'bg-red-50 text-[#E30613]',
    COMPLETED: 'bg-zinc-900 text-white',
    CANCELLED: 'bg-red-50 text-[#E30613]',
  };

  const STATUS_LABELS = {
    ACTIVE: 'Active',
    NOT_STARTED: 'Not started',
    IN_PROGRESS: 'In progress',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
  };

  const details = [
    { label: 'Start date', value: formatDate(program.startDate) },
    { label: 'End date', value: formatDate(program.endDate) },
    { label: 'Capacity', value: program.capacity ? `${program.capacity} seats` : 'N/A' },
    { label: 'Enrolled', value: `${program.enrolledCount || 0} enrolled` },
    { label: 'Location', value: program.location || 'Not specified' },
    { label: 'Field', value: program.type || 'Not specified' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

        <div className="lg:col-span-2 min-w-0">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">
            About this programme
          </h3>
          <div
            className="text-sm text-zinc-700 leading-relaxed break-words
              [&_p]:mb-3 [&_a]:text-[#E30613] [&_a]:underline
              [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5
              [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5
              [&_h1]:text-lg [&_h1]:font-bold [&_h1]:text-zinc-900 [&_h1]:mb-2
              [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-zinc-900 [&_h2]:mb-2
              [&_h3]:text-sm [&_h3]:font-bold [&_h3]:text-zinc-900 [&_h3]:mb-1.5
              [&_strong]:text-zinc-900 [&_strong]:font-bold
              [&_img]:rounded-lg [&_img]:max-w-full [&_img]:my-3"
            dangerouslySetInnerHTML={{
              __html: program.description || 'No description provided.',
            }}
          />
        </div>

        <div className="lg:col-span-1">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">
            Programme details
          </h3>

          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
            {details.map((row, i) => (
              <div
                key={i}
                className={`flex items-center justify-between gap-3 px-4 py-3 ${
                  i !== details.length - 1 ? 'border-b border-zinc-100' : ''
                }`}
              >
                <span className="text-xs text-zinc-500 uppercase tracking-wider font-bold">
                  {row.label}
                </span>
                <span className="text-sm text-zinc-900 font-medium truncate text-right max-w-[60%]">
                  {row.value}
                </span>
              </div>
            ))}

            {program.status && (
              <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-zinc-100">
                <span className="text-xs text-zinc-500 uppercase tracking-wider font-bold">
                  Status
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider whitespace-nowrap ${
                    STATUS_STYLES[program.status] || 'bg-zinc-100 text-zinc-600'
                  }`}
                >
                  {STATUS_LABELS[program.status] || program.status}
                </span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}