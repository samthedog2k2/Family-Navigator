import {
  Circle,
  Sun,
  Sunrise,
  Sunset,
  Moon,
  PartyPopper,
  Calendar,
  Heart,
  Users,
  Flag,
  Star,
  Crown,
  Gift,
  TreePine
} from "lucide-react";

// Modern moon phase icons using Lucide React
export function getMoonPhaseIcon(phaseName: string, size: number = 16) {
  const iconProps = { size, className: "text-slate-600 dark:text-slate-400" };

  switch (phaseName) {
    case 'New Moon':
      return <Circle {...iconProps} className="text-slate-800 dark:text-slate-200 fill-current" />;
    case 'Waxing Crescent':
      return <Moon {...iconProps} className="text-slate-600 dark:text-slate-400 rotate-[270deg]" />;
    case 'First Quarter':
      return <Moon {...iconProps} className="text-slate-600 dark:text-slate-400 rotate-[180deg]" />;
    case 'Waxing Gibbous':
      return <Moon {...iconProps} className="text-slate-600 dark:text-slate-400 rotate-[90deg]" />;
    case 'Full Moon':
      return <Circle {...iconProps} className="text-yellow-400 dark:text-yellow-300 fill-current" />;
    case 'Waning Gibbous':
      return <Moon {...iconProps} className="text-slate-600 dark:text-slate-400 rotate-[270deg] scale-x-[-1]" />;
    case 'Last Quarter':
      return <Moon {...iconProps} className="text-slate-600 dark:text-slate-400 scale-x-[-1]" />;
    case 'Waning Crescent':
      return <Moon {...iconProps} className="text-slate-600 dark:text-slate-400 rotate-[90deg] scale-x-[-1]" />;
    default:
      return <Moon {...iconProps} />;
  }
}

// Modern sunrise/sunset icons
export function getSunriseIcon(size: number = 16) {
  return <Sunrise size={size} className="text-orange-500 dark:text-orange-400" />;
}

export function getSunsetIcon(size: number = 16) {
  return <Sunset size={size} className="text-orange-600 dark:text-orange-500" />;
}

// Modern holiday icons
export function getHolidayIcon(holidayName: string, size: number = 16) {
  const iconProps = { size, className: "text-sky-600 dark:text-sky-400" };

  switch (holidayName) {
    case "New Year's Day":
      return <PartyPopper {...iconProps} className="text-purple-600 dark:text-purple-400" />;
    case "Martin Luther King Jr. Day":
      return <Heart {...iconProps} className="text-red-600 dark:text-red-400" />;
    case "Presidents' Day":
      return <Crown {...iconProps} className="text-blue-600 dark:text-blue-400" />;
    case "Memorial Day":
      return <Flag {...iconProps} className="text-red-600 dark:text-red-400" />;
    case "Juneteenth":
      return <Star {...iconProps} className="text-green-600 dark:text-green-400" />;
    case "Independence Day":
      return <Flag {...iconProps} className="text-red-600 dark:text-red-400" />;
    case "Labor Day":
      return <Users {...iconProps} className="text-blue-600 dark:text-blue-400" />;
    case "Columbus Day":
      return <Calendar {...iconProps} className="text-blue-600 dark:text-blue-400" />;
    case "Veterans Day":
      return <Flag {...iconProps} className="text-red-600 dark:text-red-400" />;
    case "Thanksgiving Day":
      return <Heart {...iconProps} className="text-orange-600 dark:text-orange-400" />;
    case "Christmas Day":
      return <TreePine {...iconProps} className="text-green-600 dark:text-green-400" />;
    default:
      return <Calendar {...iconProps} />;
  }
}

// Phase descriptions for tooltips
export function getMoonPhaseDescription(phaseName: string): string {
  switch (phaseName) {
    case 'New Moon':
      return 'New Moon - Moon is not visible';
    case 'Waxing Crescent':
      return 'Waxing Crescent - Growing toward First Quarter';
    case 'First Quarter':
      return 'First Quarter - Half of moon is visible';
    case 'Waxing Gibbous':
      return 'Waxing Gibbous - Growing toward Full Moon';
    case 'Full Moon':
      return 'Full Moon - Entire moon is visible';
    case 'Waning Gibbous':
      return 'Waning Gibbous - Shrinking from Full Moon';
    case 'Last Quarter':
      return 'Last Quarter - Half of moon is visible';
    case 'Waning Crescent':
      return 'Waning Crescent - Shrinking toward New Moon';
    default:
      return phaseName;
  }
}