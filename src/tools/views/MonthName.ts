export function getMonthName(month: number): string {
  const date = new Date(2000, month - 1, 1);
  const monthName = date.toLocaleString(navigator.language, { month: "long" });
  return monthName;
}
