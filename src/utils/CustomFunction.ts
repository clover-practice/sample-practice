// utils/customFunctions.ts

/**
 * Returns a formatted date like: "Today | 22 Jul, Tuesday, 2025"
 */
export const getFormattedDate = (): string => {
  const today = new Date();

  const day = today.getDate();
  const month = today.toLocaleString('default', {month: 'short'});
  const weekday = today.toLocaleString('default', {weekday: 'long'});
  const year = today.getFullYear();

  return `Today | ${day} ${month}, ${weekday}, ${year}`;
};

/**
 * Generates an array of dates for the current month only.
 */
export const getCurrentMonthDays = () => {
  const days = [];
  const today = new Date();
  const currentMonth = today.getMonth();

  let i = 0;
  while (true) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    if (date.getMonth() !== currentMonth) break;

    days.push({
      id: i,
      date,
      day: date.toLocaleString('default', {weekday: 'short'}),
      dateNum: date.getDate(),
      month: date.toLocaleString('default', {month: 'short'}),
    });

    i++;
  }

  return days;
};

export const isSameDate = (a: Date, b: Date): boolean => {
  return (
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  );
};
