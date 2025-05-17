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
    dateStr = dateFormatter
      .formatToParts(date)
      .map((obj) => {
        return obj.type === "year" ? obj.value.padStart(4, "0") : obj.value;
      })
      .join("");
    dateCache.set(date, dateStr);
  }
  return dateStr;
}

export function formatTime(date: Date): string {
  return timeFormatter.format(date);
}

export function getISOStringDate(date: Date): string {
  let dateStr = date.getFullYear().toString().padStart(4, "0") + "-";
  dateStr += (date.getMonth() + 1).toString().padStart(2, "0") + "-";
  dateStr += date.getDate().toString().padStart(2, "0");
  return dateStr;
}
