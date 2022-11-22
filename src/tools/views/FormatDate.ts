export function formatDateWithTime(date: Date): string {
  //avoid comma between date and time
  const dateStr = new Intl.DateTimeFormat("default", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
  const timeStr = new Intl.DateTimeFormat("default", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
  return dateStr + " " + timeStr;
}

export function formatDate(date: Date): string {
  const dateStr = new Intl.DateTimeFormat("default", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
  return dateStr;
}
