export function getMonthName(month: number): string {
  const date = new Date(2000, month - 1, 1); // 2009-11-10
  const monthName = date.toLocaleString("default", { month: "long" });
  return monthName;
}
