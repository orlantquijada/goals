const weekdayFormat = new Intl.DateTimeFormat('en-US', { weekday: 'short' });
export function weekdayFormatDate(date: Date) {
  return weekdayFormat.format(date);
}
