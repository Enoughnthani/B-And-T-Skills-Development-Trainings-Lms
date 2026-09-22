// components/TestTimer.jsx
import { useEffect, useState } from 'react';
import { FaClock } from 'react-icons/fa';

export default function TestTimer({ durationMinutes, onTimeOut, testId }) {
  const [timeRemaining, setTimeRemaining] = useState(null);

  useEffect(() => {
    const startTime = localStorage.getItem(`test_start_${testId}`);
    const now = new Date();
    
    let remainingSeconds;
    if (startTime) {
      const elapsed = Math.floor((now - new Date(startTime)) / 1000);
      remainingSeconds = Math.max(0, (durationMinutes * 60) - elapsed);
    } else {
      remainingSeconds = durationMinutes * 60;
      localStorage.setItem(`test_start_${testId}`, now.toISOString());
    }
    
    setTimeRemaining(remainingSeconds);
    
    if (remainingSeconds <= 0) {
      onTimeOut();
      return;
    }
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [durationMinutes, onTimeOut, testId]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (!timeRemaining) return 'text-gray-600';
    if (timeRemaining < 300) return 'text-red-600';
    if (timeRemaining < 600) return 'text-orange-500';
    return 'text-green-600';
  };

  return (
    <div className={`flex items-center gap-2 font-mono font-bold ${getTimerColor()}`}>
      <FaClock />
      <span>{timeRemaining !== null ? formatTime(timeRemaining) : '--:--'}</span>
    </div>
  );
}