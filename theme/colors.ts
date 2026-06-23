export const colors = {
  // Primary
  primary: '#6C63FF',
  primaryLight: '#E8E6FF',
  primaryDark: '#5A52D9',

  // Backgrounds
  background: '#F8F8FC',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',

  // Text
  textPrimary: '#1A1A2E',
  textSecondary: '#8E8E93',
  textTertiary: '#AEAEB2',
  textInverse: '#FFFFFF',

  // Borders & Dividers
  border: '#E5E5EA',
  divider: '#F2F2F7',

  // Vote System
  voteTrue: '#6C63FF',
  voteMisleading: '#FF9500',
  voteFalse: '#FF3B30',

  // Semantic
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#007AFF',

  // Misc
  verified: '#6C63FF',
  unreadDot: '#007AFF',
  overlay: 'rgba(0, 0, 0, 0.4)',
  skeleton: '#E5E5EA',
  skeletonHighlight: '#F2F2F7',

  // Tab Bar
  tabBarBackground: '#FFFFFF',
  tabBarActive: '#6C63FF',
  tabBarInactive: '#8E8E93',

  // Badge
  badgeNew: '#FF3B30',
  badgeNewText: '#FFFFFF',
} as const;

export type ColorKey = keyof typeof colors;
