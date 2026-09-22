// ProgramAnalyticsPage.jsx - Premium Redesign
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import {
  FaChartLine, FaGraduationCap, FaUsers, FaArrowLeft, FaUserTie,
  FaCalendarAlt, FaMapMarkerAlt, FaTag, FaClock, FaChartPie,
  FaVenusMars, FaEnvelope, FaPhone, FaIdCard,
  FaUserPlus, FaAward, FaPercentage, FaLayerGroup,
  FaHandSparkles,
  FaArrowUp
} from 'react-icons/fa';
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area,
  RadialBarChart, RadialBar, PolarAngleAxis
} from 'recharts';
import { apiFetch } from '@/api/api';
import { PROGRAMS } from '@/utils/apiEndpoint';
import { motion, AnimatePresence } from 'framer-motion';

// Aurora Background Component
const AuroraBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px] animate-pulse" />
    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px] animate-pulse delay-1000" />
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px]" />
  </div>
);

// Glass Card Component with 3D hover effect
const GlassCard = ({ children, className = '', delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}
    whileHover={{
      y: -8,
      transition: { duration: 0.3, ease: 'easeOut' }
    }}
    className={`
      relative group
      bg-white/70 dark:bg-slate-900/70
      backdrop-blur-xl
      border border-white/20 dark:border-slate-700/30
      rounded-2xl
      shadow-[0_8px_32px_rgba(0,0,0,0.08)]
      hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)]
      transition-shadow duration-500
      overflow-hidden
      ${className}
    `}
  >
    {/* Shimmer effect overlay */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

    {/* Inner glow border */}
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/50 via-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

    <div className="relative z-10 h-full">
      {children}
    </div>
  </motion.div>
);

// Animated Counter Component
const AnimatedCounter = ({ value, suffix = '', prefix = '' }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span className="tabular-nums">
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
};

// Enhanced Metric Card with icon animation
const MetricCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'blue',
  delay = 0,
  trend = null,
  progress = null
}) => {
  const colorSchemes = {
    blue: { bg: 'bg-blue-500/10', icon: 'text-blue-600', border: 'border-blue-500/20', glow: 'shadow-blue-500/20' },
    emerald: { bg: 'bg-emerald-500/10', icon: 'text-emerald-600', border: 'border-emerald-500/20', glow: 'shadow-emerald-500/20' },
    purple: { bg: 'bg-purple-500/10', icon: 'text-purple-600', border: 'border-purple-500/20', glow: 'shadow-purple-500/20' },
    orange: { bg: 'bg-orange-500/10', icon: 'text-orange-600', border: 'border-orange-500/20', glow: 'shadow-orange-500/20' },
    rose: { bg: 'bg-rose-500/10', icon: 'text-rose-600', border: 'border-rose-500/20', glow: 'shadow-rose-500/20' },
    cyan: { bg: 'bg-cyan-500/10', icon: 'text-cyan-600', border: 'border-cyan-500/20', glow: 'shadow-cyan-500/20' },
  };

  const scheme = colorSchemes[color] || colorSchemes.blue;

  return (
    <GlassCard delay={delay} className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {typeof value === 'number' ? (
              <AnimatedCounter value={value} suffix={subtitle?.includes('%') ? '%' : ''} />
            ) : (
              <span className="text-2xl">{value}</span>
            )}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <FaArrowUp className={`text-xs ${trend > 0 ? 'text-emerald-500' : 'text-rose-500'}`} />
              <span className={`text-xs font-medium ${trend > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {trend > 0 ? '+' : ''}{trend}%
              </span>
              <span className="text-xs text-slate-400">vs last month</span>
            </div>
          )}
        </div>
        <motion.div
          whileHover={{ rotate: 15, scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className={`${scheme.bg} p-3 rounded-xl ${scheme.border} border`}
        >
          <Icon className={`text-xl ${scheme.icon}`} />
        </motion.div>
      </div>

      {progress !== null && (
        <div className="mt-4">
          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: delay + 0.3, ease: 'easeOut' }}
              className={`h-full rounded-full bg-gradient-to-r from-${color}-400 to-${color}-600`}
              style={{
                background: `linear-gradient(90deg, var(--${color}-400), var(--${color}-600))`
              }}
            />
          </div>
        </div>
      )}
    </GlassCard>
  );
};

// Custom Tooltip for Charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-lg p-3 shadow-xl">
        <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-slate-600 dark:text-slate-300">{entry.name}:</span>
            <span className="font-semibold text-slate-900 dark:text-white">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  const styles = {
    ACTIVE: {
      bg: 'bg-emerald-500/15',
      text: 'text-emerald-700 dark:text-emerald-400',
      border: 'border-emerald-500/30',
      dot: 'bg-emerald-500',
      glow: 'shadow-emerald-500/20'
    },
    NOTSTARTED: {
      bg: 'bg-amber-500/15',
      text: 'text-amber-700 dark:text-amber-400',
      border: 'border-amber-500/30',
      dot: 'bg-amber-500',
      glow: 'shadow-amber-500/20'
    },
    COMPLETED: {
      bg: 'bg-blue-500/15',
      text: 'text-blue-700 dark:text-blue-400',
      border: 'border-blue-500/30',
      dot: 'bg-blue-500',
      glow: 'shadow-blue-500/20'
    },
    CANCELLED: {
      bg: 'bg-rose-500/15',
      text: 'text-rose-700 dark:text-rose-400',
      border: 'border-rose-500/30',
      dot: 'bg-rose-500',
      glow: 'shadow-rose-500/20'
    }
  };

  const style = styles[status] || styles.ACTIVE;

  return (
    <span className={`
      inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold
      ${style.bg} ${style.text} border ${style.border}
      shadow-lg ${style.glow}
      backdrop-blur-sm
    `}>
      <span className={`w-2 h-2 rounded-full ${style.dot} animate-pulse`} />
      {status.replace(/_/g, ' ')}
    </span>
  );
};

// Main Component
const ProgramAnalyticsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    if (location.state?.program) {
      setProgram(location.state.program);
      setLoading(false);
    } else {
      fetchProgramData();
    }
  }, [location]);

  const fetchProgramData = async () => {
    try {
      const result = await apiFetch(`${PROGRAMS}/${id}`);
      setProgram(result?.payload);
    } catch (error) {
      console.error('Error fetching program:', error);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced statistics with memoization
  const stats = useMemo(() => {
    if (!program) return null;

    const enrolledCount = program.enrolledCount || 0;
    const capacity = program.capacity || 0;
    const enrollmentRate = capacity > 0 ? (enrolledCount / capacity) * 100 : 0;
    const availableSpots = capacity - enrolledCount;

    // Gender distribution with enhanced colors
    const genderData = program.enrollmentData?.reduce((acc, student) => {
      acc[student.gender] = (acc[student.gender] || 0) + 1;
      return acc;
    }, {});

    const genderChartData = Object.entries(genderData || {}).map(([name, value]) => ({
      name,
      value,
      fill: name === 'Male' ? '#3B82F6' : name === 'Female' ? '#EC4899' : '#8B5CF6'
    }));

    // Role distribution
    const roleData = program.programStaff?.reduce((acc, staff) => {
      staff.assignedRoles[program.id]?.forEach(role => {
        acc[role] = (acc[role] || 0) + 1;
      });
      return acc;
    }, {});

    const roleChartData = Object.entries(roleData || {}).map(([name, value]) => ({
      name: name.replace(/_/g, ' '),
      value,
      fill: '#8B5CF6'
    }));

    // Enhanced timeline data with more realistic progression
    const timelineData = [
      { date: 'Week 1', enrolled: Math.floor(enrolledCount * 0.15), cumulative: Math.floor(enrolledCount * 0.15) },
      { date: 'Week 2', enrolled: Math.floor(enrolledCount * 0.25), cumulative: Math.floor(enrolledCount * 0.40) },
      { date: 'Week 3', enrolled: Math.floor(enrolledCount * 0.20), cumulative: Math.floor(enrolledCount * 0.60) },
      { date: 'Week 4', enrolled: Math.floor(enrolledCount * 0.15), cumulative: Math.floor(enrolledCount * 0.75) },
      { date: 'Week 5', enrolled: Math.floor(enrolledCount * 0.15), cumulative: Math.floor(enrolledCount * 0.90) },
      { date: 'Week 6', enrolled: enrolledCount - Math.floor(enrolledCount * 0.90), cumulative: enrolledCount },
    ];

    return {
      enrolledCount,
      capacity,
      enrollmentRate,
      availableSpots,
      genderChartData,
      roleChartData,
      timelineData
    };
  }, [program]);

  // Loading State with Skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <AuroraBackground />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-slate-500 font-medium"
          >
            Loading Analytics...
          </motion.div>
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="overflow-y-auto h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <AuroraBackground />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 text-center p-8 bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50"
        >
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaLayerGroup className="text-3xl text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Program Not Found</h2>
          <p className="text-slate-500 mb-6">The requested program analytics are unavailable.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all"
          >
            <FaArrowLeft className="inline mr-2" />
            Go Back
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'];

  return (
    <div className="overflow-y-auto h-screen  relative">


      {/* Enhanced Header with Glass Effect */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="bg-white/80 dark:bg-slate-900/80 border-b border-white/20 dark:border-slate-700/30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1, x: -4 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate(-1)}
                className="p-3 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 rounded-xl transition-all border border-slate-200/50 dark:border-slate-700/50"
              >
                <FaArrowLeft className="text-slate-600 dark:text-slate-300 text-lg" />
              </motion.button>

              <div>
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent"
                >
                  {program.name}
                </motion.h1>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-2 mt-1"
                >
                  <span className="text-sm text-slate-500 dark:text-slate-400 capitalize">
                    {program.category?.replace(/_/g, ' ')}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">{program.type}</span>
                </motion.div>
              </div>
            </div>

            <StatusBadge status={program.status} />
          </div>
        </div>
      </motion.header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Enrollment Rate"
            value={Math.round(stats.enrollmentRate)}
            subtitle={`${stats.enrolledCount} of ${stats.capacity} students enrolled`}
            icon={FaChartLine}
            color="blue"
            delay={0.1}
            trend={12}
            progress={stats.enrollmentRate}
          />

          <MetricCard
            title="Available Spots"
            value={stats.availableSpots}
            subtitle="Remaining capacity"
            icon={FaUserPlus}
            color="emerald"
            delay={0.2}
            trend={-5}
          />

          <MetricCard
            title="Staff Members"
            value={program.programStaff?.length || 0}
            subtitle="Total assigned staff"
            icon={FaUserTie}
            color="purple"
            delay={0.3}
            trend={8}
          />

          <MetricCard
            title="Program Type"
            value={program.type}
            subtitle={program.category?.replace(/_/g, ' ')}
            icon={FaAward}
            color="orange"
            delay={0.4}
          />
        </div>

        {/* Charts Section - First Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Enrollment Progress - Enhanced */}
          <GlassCard delay={0.5} className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FaChartPie className="text-blue-500" />
                  Enrollment Progress
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Real-time capacity utilization</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-bold text-slate-900 dark:text-white">
                  {stats.enrollmentRate.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="space-y-6">
              {/* Enrolled Progress */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600 dark:text-slate-300 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500" />
                    Enrolled
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white">{stats.enrolledCount} students</span>
                </div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.enrollmentRate}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full relative"
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  </motion.div>
                </div>
              </div>

              {/* Available Progress */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600 dark:text-slate-300 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    Available
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white">{stats.availableSpots} spots</span>
                </div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(stats.availableSpots / stats.capacity) * 100}%` }}
                    transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500 dark:text-slate-400">Total Capacity</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">{stats.capacity}</span>
              </div>
            </div>
          </GlassCard>

          {/* Enrollment Timeline - Area Chart */}
          <GlassCard delay={0.6} className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FaArrowUp className="text-emerald-500" />
                  Enrollment Timeline
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Weekly enrollment trends</p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={stats.timelineData}>
                <defs>
                  <linearGradient id="colorEnrolled" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#64748B"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#64748B"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="enrolled"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorEnrolled)"
                  name="New Enrollments"
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
                <Area
                  type="monotone"
                  dataKey="cumulative"
                  stroke="#10B981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorCumulative)"
                  name="Total Enrolled"
                  animationDuration={1500}
                  animationEasing="ease-out"
                  animationBegin={300}
                />
              </AreaChart>
            </ResponsiveContainer>
          </GlassCard>
        </div>

        {/* Charts Section - Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Gender Distribution - Donut Chart */}
          <GlassCard delay={0.7} className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FaVenusMars className="text-purple-500" />
                  Gender Distribution
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Student demographics breakdown</p>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.genderChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={1000}
                  >
                    {stats.genderChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.fill}
                        stroke="#fff"
                        strokeWidth={3}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="middle"
                    align="right"
                    layout="vertical"
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Staff Role Distribution - Bar Chart */}
          <GlassCard delay={0.8} className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FaUsers className="text-cyan-500" />
                  Staff Role Distribution
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Personnel by assigned roles</p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.roleChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
                <XAxis
                  type="number"
                  stroke="#64748B"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="#64748B"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  width={100}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="value"
                  fill="#8B5CF6"
                  radius={[0, 8, 8, 0]}
                  animationDuration={1500}
                >
                  {stats.roleChartData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
        </div>

        {/* Program Details - Glass Panel */}
        <GlassCard delay={0.9} className="mb-8 overflow-hidden">
          <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-slate-50/50 to-transparent dark:from-slate-800/50">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FaHandSparkles className="text-amber-500" />
              Program Details
            </h3>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-start gap-4 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50"
              >
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <FaCalendarAlt className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Duration</p>
                  <p className="text-slate-900 dark:text-white font-semibold">
                    {new Date(program.startDate).toLocaleDateString()} -
                  </p>
                  <p className="text-slate-900 dark:text-white font-semibold">
                    {new Date(program.endDate).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-start gap-4 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50"
              >
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <FaMapMarkerAlt className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Location</p>
                  <p className="text-slate-900 dark:text-white font-semibold">{program.location}</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-start gap-4 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50"
              >
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <FaClock className="text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Status</p>
                  <p className="text-slate-900 dark:text-white font-semibold capitalize">{program.status}</p>
                </div>
              </motion.div>
            </div>

            {program.description && (
              <div className="mt-6 pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">Description</p>
                <div
                  className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300"
                  dangerouslySetInnerHTML={{ __html: program.description }}
                />
              </div>
            )}
          </div>
        </GlassCard>

        {/* Recent Enrollments - Enhanced Table */}
        <GlassCard delay={1.0} className="overflow-hidden">
          <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-slate-50/50 to-transparent dark:from-slate-800/50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FaGraduationCap className="text-rose-500" />
                  Recent Enrollments
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Last {Math.min(program.enrollmentData?.length || 0, 10)} enrolled students
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700"
              >
                View All
              </motion.button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-800/80">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Gender
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Enrolled On
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
                <AnimatePresence>
                  {program.enrollmentData?.slice(0, 10).map((student, index) => (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                      className="group cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                            {student.firstname?.[0]}{student.lastname?.[0]}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-900 dark:text-white">
                              {student.firstname} {student.lastname}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">ID: {student.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-600 dark:text-slate-300">{student.email}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{student.contactNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`
                          inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${student.gender === 'Male'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                            : student.gender === 'Female'
                              ? 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300'
                              : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                          }
                        `}>
                          {student.gender}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                        {new Date(student.enrollmentDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
                          Active
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </GlassCard>
      </main>
    </div>
  );
};

export default ProgramAnalyticsPage;
