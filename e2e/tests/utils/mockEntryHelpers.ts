export const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const formatHours = (hours: string) => {
  const totalMinutes = Math.round(Number(hours) * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = String(totalMinutes % 60).padStart(2, "0");
  return `${h}:${m}`;
};
