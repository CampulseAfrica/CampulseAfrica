export const lightColors = {
  // Primary
  primary: '#1A71FD',
  primaryLight: '#EBF3FF',
  primaryDark: '#0B5EDB',

  // Backgrounds
  background: '#F8F9FA',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',

  // Text
  textPrimary: '#1A1A2E',
  textSecondary: '#8E8E93',
  textTertiary: '#AEAEB2',
  textInverse: '#FFFFFF',

  // Borders & Dividers
  border: '#E5E7EB',
  divider: '#F2F2F7',

  // Vote System
  voteTrue: '#16A34A',
  voteTrueBg: '#EDF9F0',
  voteMisleading: '#D97706',
  voteMisleadingBg: '#FFF8EB',
  voteFalse: '#DC2626',
  voteFalseBg: '#FDEEEE',

  // Semantic
  success: '#16A34A',
  warning: '#D97706',
  error: '#DC2626',
  info: '#1A71FD',

  // Misc
  verified: '#1A71FD',
  unreadDot: '#1A71FD',
  overlay: 'rgba(0, 0, 0, 0.4)',
  skeleton: '#E5E7EB',
  skeletonHighlight: '#F3F4F6',

  // Tab Bar
  tabBarBackground: '#FFFFFF',
  tabBarActive: '#1A71FD',
  tabBarInactive: '#8E8E93',

  // Badge
  badgeNew: '#DC2626',
  badgeNewText: '#FFFFFF',
} as const;

export const darkColors = {
  // Primary
  primary: '#3B82F6',
  primaryLight: '#1E293B',
  primaryDark: '#1D4ED8',

  // Backgrounds
  background: '#12121A',
  surface: '#1A1A26',
  surfaceElevated: '#242436',

  // Text
  textPrimary: '#F5F5FA',
  textSecondary: '#9E9EA8',
  textTertiary: '#686878',
  textInverse: '#FFFFFF',

  // Borders & Dividers
  border: '#262638',
  divider: '#1E1E2C',

  // Vote System
  voteTrue: '#22C55E',
  voteTrueBg: 'rgba(34, 197, 94, 0.15)',
  voteMisleading: '#F59E0B',
  voteMisleadingBg: 'rgba(245, 158, 11, 0.15)',
  voteFalse: '#EF4444',
  voteFalseBg: 'rgba(239, 68, 68, 0.15)',

  // Semantic
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Misc
  verified: '#3B82F6',
  unreadDot: '#3B82F6',
  overlay: 'rgba(0, 0, 0, 0.7)',
  skeleton: '#262638',
  skeletonHighlight: '#34344A',

  // Tab Bar
  tabBarBackground: '#181824',
  tabBarActive: '#3B82F6',
  tabBarInactive: '#8E8E98',

  // Badge
  badgeNew: '#EF4444',
  badgeNewText: '#FFFFFF',
} as const;

export type ThemeColors = {
  [K in keyof typeof lightColors]: string;
};

// Default export for backward compatibility
export const colors = lightColors;

export type ColorKey = keyof typeof lightColors;
