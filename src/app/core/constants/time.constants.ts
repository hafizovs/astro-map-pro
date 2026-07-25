/** Скорость: симуляционные часы за 1 реальную секунду */
export const TIME_SPEED_PRESETS = {
  realtime: 1 / 3600,
  hourPerSec: 1,
  dayPerSec: 24,
  weekPerSec: 24 * 7,
} as const;

export type TimeSpeedPresetId = keyof typeof TIME_SPEED_PRESETS;

export const TIME_SPEED_MIN = 1 / 3600;
export const TIME_SPEED_MAX = 24 * 30;
