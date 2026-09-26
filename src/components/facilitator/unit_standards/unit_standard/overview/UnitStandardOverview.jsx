import { apiFetch } from '@/api/api';
import { useEffect, useState } from 'react';
import {
  FaBook,
  FaBriefcase,
  FaClipboardList,
  FaClock,
  FaFileAlt,
  FaGraduationCap,
  FaLink,
  FaStar,
  FaTools,
  FaVideo,
} from 'react-icons/fa';
import { useLocation, useParams } from 'react-router-dom';

const TYPE_LABELS = {
  KNOWLEDGE: 'Knowledge',
  PRACTICAL: 'Practical',
  WORK_EXPERIENCE: 'Work experience',
};

const TYPE_STYLES = {
  KNOWLEDGE: 'bg-zinc-900 text-white',
  PRACTICAL: 'bg-[#E30613] text-white',
  WORK_EXPERIENCE: 'bg-zinc-100 text-zinc-600',
};

const TYPE_ICONS = {
  KNOWLEDGE: FaBook,
  PRACTICAL: FaTools,
  WORK_EXPERIENCE: FaBriefcase,
};

const STATUS_LABELS = {
  ACTIVE: 'Active',
  PHASED_OUT: 'Phased out',
  PENDING: 'Pending',
};

const STATUS_STYLES = {
  ACTIVE: 'bg-zinc-100 text-zinc-700',
  PHASED_OUT: 'bg-red-50 text-[#E30613]',
  PENDING: 'bg-zinc-100 text-zinc-500',
};

export default function UnitStandardOverview() {
  const { unitStandardId } = useParams();
  const location = useLocation();
  const [unitStandard, setUnitStandard] = useState(
    location?.state?.unitStandard || null
  );
  const [loading, setLoading] = useState(!location?.state?.unitStandard);

  useEffect(() => {
    if (unitStandard || !unitStandardId) return;

    async function load() {
      setLoading(true);
      try {
        const result = await apiFetch(`/api/unit-standards/${unitStandardId}`);
        if (result?.payload) setUnitStandard(result.payload);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [unitStandardId]);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-zinc-200 border-t-[#E30613]" />
          <p className="mt-3 text-sm text-zinc-500">Loading module…</p>
        </div>
      </div>
    );
  }

  if (!unitStandard) {
    return (
      <div className="p-8 text-center text-sm text-zinc-500">
        Module not found.
      </div>
    );
  }

  const TypeIcon = TYPE_ICONS[unitStandard.type?.toUpperCase()] || FaBook;
  const notionalHours =
    unitStandard.notionalHours || (unitStandard.credits || 0) * 10;

  const hasDescription =
    unitStandard.description ||
    unitStandard.purpose ||
    unitStandard.learningAssumed ||
    unitStandard.rangeStatement;

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full">

      <div className="bg-white border border-zinc-200 rounded-xl p-4 sm:p-6 mb-5">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="font-mono text-xs font-bold text-zinc-700 bg-zinc-100 px-2 py-1 rounded">
            {unitStandard.unitStandardId}
          </span>
          {renderTypeBadge(unitStandard.type)}
          {renderStatusBadge(unitStandard.status)}
          {unitStandard.programName && (
            <span className="text-xs text-zinc-500">
              {unitStandard.programName}
            </span>
          )}
        </div>

        <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 mb-3 break-words">
          {unitStandard.title}
        </h1>

        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-zinc-500">
          {unitStandard.credits != null && (
            <span className="flex items-center gap-1.5">
              <FaStar size={12} className="text-[#E30613]" />
              {unitStandard.credits} credits
            </span>
          )}
          {unitStandard.nqfLevel && (
            <span className="flex items-center gap-1.5">
              <FaGraduationCap size={12} />
              {unitStandard.nqfLevel}
            </span>
          )}
          {unitStandard.updatedAt && (
            <span className="flex items-center gap-1.5">
              <FaClock size={12} />
              Updated{' '}
              {new Date(unitStandard.updatedAt).toLocaleDateString('en-ZA', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          )}
          {unitStandard.moderationBody && (
            <span className="flex items-center gap-1.5">
              Moderated by {unitStandard.moderationBody}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">

        <div className="bg-white border border-zinc-200 rounded-xl p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="w-9 h-9 bg-zinc-100 rounded-lg flex items-center justify-center">
              <FaBook className="text-zinc-600" size={14} />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-zinc-900 tabular-nums mb-0.5">
            {unitStandard.contentCount || 0}
          </div>
          <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
            Learning content
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500 mt-3 pt-3 border-t border-zinc-100">
            <span className="flex items-center gap-1">
              <FaFileAlt size={10} /> Files
            </span>
            <span className="flex items-center gap-1">
              <FaVideo size={10} /> Videos
            </span>
            <span className="flex items-center gap-1">
              <FaLink size={10} /> Links
            </span>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="w-9 h-9 bg-zinc-100 rounded-lg flex items-center justify-center">
              <FaClipboardList className="text-zinc-600" size={14} />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-zinc-900 tabular-nums mb-0.5">
            {unitStandard.assessmentCount || 0}
          </div>
          <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
            Assessments
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500 mt-3 pt-3 border-t border-zinc-100">
            <span>Formative</span>
            <span>Summative</span>
            <span>PoE</span>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-900 rounded-xl p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center">
              <FaClock className="text-white" size={14} />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white tabular-nums mb-0.5">
            {notionalHours}
          </div>
          <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            Notional hours
          </div>
          <div className="text-xs text-zinc-400 mt-3 pt-3 border-t border-zinc-800">
            {unitStandard.notionalHours
              ? 'Recorded from QCTO curriculum'
              : `Estimated from ${unitStandard.credits || 0} credits`}
          </div>
        </div>
      </div>

      {hasDescription && (
        <div className="bg-white border border-zinc-200 rounded-xl p-4 sm:p-6 space-y-5">

          {unitStandard.purpose && (
            <Section title="Purpose">
              <p className="text-sm text-zinc-700 leading-relaxed break-words whitespace-pre-line">
                {unitStandard.purpose}
              </p>
            </Section>
          )}

          {unitStandard.description && (
            <Section title="Description">
              <p className="text-sm text-zinc-700 leading-relaxed break-words whitespace-pre-line">
                {unitStandard.description}
              </p>
            </Section>
          )}

          {unitStandard.learningAssumed && (
            <Section title="Learning assumed to be in place">
              <p className="text-sm text-zinc-700 leading-relaxed break-words whitespace-pre-line">
                {unitStandard.learningAssumed}
              </p>
            </Section>
          )}

          {unitStandard.rangeStatement && (
            <Section title="Range statement">
              <p className="text-sm text-zinc-700 leading-relaxed break-words whitespace-pre-line">
                {unitStandard.rangeStatement}
              </p>
            </Section>
          )}
        </div>
      )}

      {(unitStandard.specificOutcomes?.length > 0 ||
        unitStandard.assessmentCriteria?.length > 0 ||
        unitStandard.criticalCrossFieldOutcomes?.length > 0) && (
        <div className="bg-white border border-zinc-200 rounded-xl p-4 sm:p-6 mt-5 space-y-5">

          {unitStandard.specificOutcomes?.length > 0 && (
            <Section title="Specific outcomes">
              <ul className="space-y-2">
                {unitStandard.specificOutcomes.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-zinc-700"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E30613] mt-2 shrink-0" />
                    <span className="break-words">{item}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {unitStandard.assessmentCriteria?.length > 0 && (
            <Section title="Assessment criteria">
              <ul className="space-y-2">
                {unitStandard.assessmentCriteria.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-zinc-700"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E30613] mt-2 shrink-0" />
                    <span className="break-words">{item}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {unitStandard.criticalCrossFieldOutcomes?.length > 0 && (
            <Section title="Critical cross-field outcomes">
              <ul className="space-y-2">
                {unitStandard.criticalCrossFieldOutcomes.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-zinc-700"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-2 shrink-0" />
                    <span className="break-words">{item}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
        {title}
      </h2>
      {children}
    </div>
  );
}

function renderTypeBadge(type) {
  if (!type) return null;
  const key = type.toUpperCase();
  return (
    <span
      className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
        TYPE_STYLES[key] || 'bg-zinc-100 text-zinc-600'
      }`}
    >
      {TYPE_LABELS[key] || type}
    </span>
  );
}

function renderStatusBadge(status) {
  if (!status) return null;
  const key = status.toUpperCase();
  return (
    <span
      className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
        STATUS_STYLES[key] || 'bg-zinc-100 text-zinc-600'
      }`}
    >
      {STATUS_LABELS[key] || status}
    </span>
  );
}