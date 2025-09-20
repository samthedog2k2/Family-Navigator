
import holidays from './us-holidays.json';
import { format } from 'date-fns';

export function getHoliday(date: Date): string | null {
  const key = format(date, 'yyyy-MM-dd');
  return (holidays as Record<string, string>)[key] || null;
}
