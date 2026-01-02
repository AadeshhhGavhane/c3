export function getFormattedDate(date: Date = new Date(), t?: (key: string) => string) {
  const dayIndex = date.getDay();
  const monthIndex = date.getMonth();
  const day = date.getDate();
  
  // Day name mapping: 0=Sunday, 1=Monday, etc.
  const dayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const shortDayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  
  // Month name mapping: 0=Jan, 1=Feb, etc.
  const monthKeys = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  
  // Use translations if available, otherwise fallback to English
  const dayName = t ? t(`days.${dayKeys[dayIndex]}`) : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayIndex];
  const shortDayName = t ? t(`days.${shortDayKeys[dayIndex]}`) : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayIndex];
  const month = t ? t(`months.${monthKeys[monthIndex]}`) : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][monthIndex];
  
  // Get ordinal suffix (1st, 2nd, 3rd, 4th, etc.) - only for English
  const getOrdinalSuffix = (n: number) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };
  
  return {
    dayName,
    day,
    month,
    dayWithSuffix: getOrdinalSuffix(day),
    shortDate: `${day} ${month}`,
    fullDate: `${dayName}, ${getOrdinalSuffix(day)} ${month}`,
    shortDayName,
  };
}

export function getWeekDays(startDate: Date = new Date()) {
  // Get Monday of the current week (create a new date to avoid mutation)
  const date = new Date(startDate);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const monday = new Date(date);
  monday.setDate(diff);
  
  const weekDays = [];
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayKeys: Array<'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday'> = [
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'
  ];
  const today = new Date();
  
  for (let i = 0; i < 6; i++) {
    const weekDate = new Date(monday);
    weekDate.setDate(monday.getDate() + i);
    weekDays.push({
      shortName: dayNames[i],
      dayKey: dayKeys[i],
      date: weekDate.getDate(),
      month: weekDate.toLocaleString('default', { month: 'short' }),
      fullDate: weekDate,
      isToday: weekDate.toDateString() === today.toDateString(),
    });
  }
  
  return weekDays;
}

