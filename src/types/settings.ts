export interface Settings {
  intervalMinutes: number;
  startHour: number;
  endHour: number;
  isActive: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  intervalMinutes: 60,
  startHour: 8,
  endHour: 22,
  isActive: true,
};

export const INTERVAL_OPTIONS = [15, 30, 45, 60, 90, 120];
export const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => i);