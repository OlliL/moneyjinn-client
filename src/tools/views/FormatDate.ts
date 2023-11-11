const dateFormatter = new Intl.DateTimeFormat("default", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("default", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});
const dateCache = new Map<Date, string>();

export function formatDateWithTime(date: Date): string {
  //avoid comma between date and time
  const dateStr = formatDate(date);
  const timeStr = formatTime(date);
  return dateStr + " " + timeStr;
}

export function formatDate(date: Date): string {
  let dateStr = dateCache.get(date);
  if (dateStr === undefined) {
    dateStr = dateFormatter.format(date);
    dateCache.set(date, dateStr);
  }
  return dateStr;
}

export function formatTime(date: Date): string {
  return timeFormatter.format(date);
}

export function getISOStringDate(date: Date): string {
  let dateStr = date.getFullYear() + "-";
  dateStr += leftpad(date.getMonth() + 1) + "-";
  dateStr += leftpad(date.getDate());
  return dateStr;
}

function leftpad(num: number, resultLength = 2, leftpadChar = "0"): string {
  return (String(leftpadChar).repeat(resultLength) + String(num)).slice(
    String(num).length,
  );
}
