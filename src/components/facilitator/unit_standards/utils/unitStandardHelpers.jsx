import { FaStar, FaAward, FaCode, FaGraduationCap } from 'react-icons/fa';

export const getTypeBadge = (type) => {
  const styles = {
    FUNDAMENTAL: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: <FaStar size={10} /> },
    CORE: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: <FaAward size={10} /> },
    ELECTIVE: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', icon: <FaCode size={10} /> }
  };
  const style = styles[type] || styles.CORE;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text} border ${style.border}`}>
      {style.icon}
      {type}
    </span>
  );
};

export const getNQFBadge = (level) => {
  const levelNum = parseInt(level?.split(' ')[2] || 4);
  let color = levelNum <= 4 ? 'bg-amber-50 text-amber-700 border-amber-200' 
            : levelNum <= 6 ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : 'bg-purple-50 text-purple-700 border-purple-200';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${color} border`}>
      <FaGraduationCap size={10} className="mr-1" />
      {level}
    </span>
  );
};