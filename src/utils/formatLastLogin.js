export function formatLastLogin(date){
  if (!date) return null;

  const now = new Date();
  const loginDate = new Date(date);

  // Calculate difference in days
  const diffMs = now - loginDate;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // Format time
  const timeStr = loginDate.toLocaleTimeString("en", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });

  if (diffDays === 0) return `Today at ${timeStr}`;
  if (diffDays === 1) return `Yesterday at ${timeStr}`;

  // Otherwise show weekday + date + time
  const dateStr = loginDate.toLocaleString("en", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return `${dateStr} at ${timeStr}`;
};
