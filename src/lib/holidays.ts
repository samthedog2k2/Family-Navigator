
'use server';

import {
  isSameDay,
  isNthDayOfMonth,
  isLastDayOfMonth,
  isMonday,
  isThursday,
  getDay,
  getYear,
  set,
} from 'date-fns';

type Holiday = {
  name: string;
  isDate: (date: Date) => boolean;
};

// --- Fixed Date Holidays ---
const newYearsDay = {
  name: "New Year's Day",
  isDate: (date: Date) => date.getMonth() === 0 && date.getDate() === 1,
};

const juneteenth = {
  name: 'Juneteenth',
  isDate: (date: Date) => date.getMonth() === 5 && date.getDate() === 19,
};

const independenceDay = {
  name: 'Independence Day',
  isDate: (date: Date) => date.getMonth() === 6 && date.getDate() === 4,
};

const veteransDay = {
  name: 'Veterans Day',
  isDate: (date: Date) => date.getMonth() === 10 && date.getDate() === 11,
};

const christmasDay = {
  name: 'Christmas Day',
  isDate: (date: Date) => date.getMonth() === 11 && date.getDate() === 25,
};


// --- Floating Holidays ---

// 3rd Monday in January
const martinLutherKingJrDay = {
  name: 'Martin Luther King Jr. Day',
  isDate: (date: Date) =>
    date.getMonth() === 0 && isMonday(date) && isNthDayOfMonth(date, 3),
};

// 3rd Monday in February
const presidentsDay = {
  name: "Presidents' Day",
  isDate: (date: Date) =>
    date.getMonth() === 1 && isMonday(date) && isNthDayOfMonth(date, 3),
};

// Last Monday in May
const memorialDay = {
  name: 'Memorial Day',
  isDate: (date: Date) => {
    if (date.getMonth() !== 4 || !isMonday(date)) return false;
    const year = getYear(date);
    const may = set(new Date(), { year, month: 4 });
    return isLastDayOfMonth(date, { weekStartsOn: 1 });
  },
};

// 1st Monday in September
const laborDay = {
  name: 'Labor Day',
  isDate: (date: Date) =>
    date.getMonth() === 8 && isMonday(date) && date.getDate() <= 7,
};

// 2nd Monday in October
const columbusDay = {
  name: 'Columbus Day',
  isDate: (date: Date) =>
    date.getMonth() === 9 && isMonday(date) && isNthDayOfMonth(date, 2),
};

// 4th Thursday in November
const thanksgivingDay = {
  name: 'Thanksgiving Day',
  isDate: (date: Date) =>
    date.getMonth() === 10 && isThursday(date) && isNthDayOfMonth(date, 4),
};


const usFederalHolidays: Holiday[] = [
  newYearsDay,
  martinLutherKingJrDay,
  presidentsDay,
  memorialDay,
  juneteenth,
  independenceDay,
  laborDay,
  columbusDay,
  veteransDay,
  thanksgivingDay,
  christmasDay,
];

/**
 * Checks if a given date is a US federal holiday.
 * @param date The date to check.
 * @returns The name of the holiday if it is one, otherwise null.
 */
export function getHoliday(date: Date): string | null {
    // Handle holidays falling on a weekend
    const dayOfWeek = getDay(date);
    const year = getYear(date);

    // If a holiday falls on Saturday, it is observed on the preceding Friday.
    if (dayOfWeek === 5) { // Friday
        const tomorrow = new Date(date);
        tomorrow.setDate(date.getDate() + 1);
        if (getYear(tomorrow) === year) {
             for (const holiday of usFederalHolidays) {
                if (holiday.isDate(tomorrow)) return holiday.name;
            }
        }
    }
    
    // If a holiday falls on Sunday, it is observed on the following Monday.
    if (dayOfWeek === 1) { // Monday
        const yesterday = new Date(date);
        yesterday.setDate(date.getDate() - 1);
        if (getYear(yesterday) === year) {
            for (const holiday of usFederalHolidays) {
                if (holiday.isDate(yesterday)) return holiday.name;
            }
        }
    }
    
    // Check for the actual holiday date
    for (const holiday of usFederalHolidays) {
        if (holiday.isDate(date)) {
            return holiday.name;
        }
    }

    return null;
}
