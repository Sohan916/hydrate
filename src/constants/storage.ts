export const STORAGE_KEYS = {
  SETTINGS: 'hydrateSettings',
  WATER_COUNT: (date: string) => `waterCount_${date}`,
} as const;