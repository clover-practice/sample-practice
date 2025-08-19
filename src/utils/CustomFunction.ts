// utils/customFunctions.ts

const customFunctions = {
  /**
   * Returns a formatted date like: "Today | 22 Jul, Tuesday, 2025"
   */
  getFormattedDate: (): string => {
    const today = new Date();

    const day = today.getDate();
    const month = today.toLocaleString('default', {month: 'short'});
    const weekday = today.toLocaleString('default', {weekday: 'long'});
    const year = today.getFullYear();

    return `Today | ${day} ${month}, ${weekday}, ${year}`;
  },

  /**
   * Generates an array of dates for the current month only.
   */
  getCurrentMonthDays: () => {
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
  },

  isSameDate: (a: Date, b: Date): boolean => {
    return (
      a.getDate() === b.getDate() &&
      a.getMonth() === b.getMonth() &&
      a.getFullYear() === b.getFullYear()
    );
  },

  getFormattedDateTime: (date: Date = new Date()): string => {
    const day = date.getDate();
    const month = date.toLocaleString('default', {month: 'short'});
    const year = date.getFullYear();
    const time = date.toLocaleString('default', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    return `${day} ${month}, ${year} ${time}`;
  },

  getFormattedTime: (date: Date = new Date()): string => {
    return date.toLocaleString('default', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  },

  parseDateTimeString: (
    dateTimeString: string,
  ): {date: string; time: string} => {
    const parts = dateTimeString.split(' ');
    const timeIndex = parts.findIndex(part => part.includes(':'));

    const dateParts = parts.slice(0, timeIndex);
    const timeParts = parts.slice(timeIndex);

    return {
      date: dateParts.join(' '),
      time: timeParts.join(' '),
    };
  },

  getFutureDateTimePlus5: (): string => {
    const date = new Date();
    date.setDate(date.getDate() + 5);
    return customFunctions.getFormattedDateTime(date);
  },

  getPastDateTimeMinus5: (): string => {
    const date = new Date();
    date.setDate(date.getDate() - 5);
    return customFunctions.getFormattedDateTime(date);
  },
};

export default customFunctions;
