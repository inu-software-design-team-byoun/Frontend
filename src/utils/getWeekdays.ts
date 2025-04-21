export const getWeekdays = (
  start: Date,
  end: Date,
  holidays: string[] = []
): string[] => {
  const result: string[] = [];
  const cur = new Date(start);

  while (cur <= end) {
    const day = cur.getDay();
    const dateStr = cur.toISOString().split("T")[0];
    if (day !== 0 && day !== 6 && !holidays.includes(dateStr)) {
      result.push(dateStr);
    }
    cur.setDate(cur.getDate() + 1);
  }

  return result;
};
