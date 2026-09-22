export function readableDate(date) {
  if (!date) return "";

  const d = new Date(date);
  if (isNaN(d)) return "";

  return d.toLocaleDateString("en-ZA", {
    weekday:"long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour:"2-digit",
    minute:"2-digit"
  });
}
