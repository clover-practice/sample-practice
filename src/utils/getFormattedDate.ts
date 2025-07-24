// utils/getFormattedDate.ts
export const getFormattedDate = (): string => {
  const today = new Date();

  const day = today.getDate();
  const month = today.toLocaleString('default', {month: 'short'}); // Jul
  const weekday = today.toLocaleString('default', {weekday: 'long'}); // Tuesday
  const year = today.getFullYear();

  return `Today | ${day} ${month}, ${weekday}, ${year}`;
};
