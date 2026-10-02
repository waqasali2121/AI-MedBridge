export const colors = {
  primary: '#001428',
  primaryContainer: '#0F2942',
  secondary: '#006A61',
  secondaryContainer: '#86F2E4',
  surface: '#F8F9FF',
  surfaceContainer: '#E5EEFF',
  surfaceContainerLow: '#EFF4FF',
  surfaceContainerLowest: '#FFFFFF',
  surfaceContainerHigh: '#DCE9FF',
  onSurface: '#0B1C30',
  onSurfaceVariant: '#43474D',
  onPrimary: '#FFFFFF',
  onSecondary: '#FFFFFF',
  error: '#BA1A1A',
  errorContainer: '#FFDAD6',
  outline: '#74777E',
  outlineVariant: '#C3C6CE',
  teal: '#0D9488',
  tealLight: '#14B8A6',

  // Semantic status colors
  status: {
    extracted: { bg: '#F0F9FF', text: '#0369A1', border: '#BAE6FD' },
    confirmed: { bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0' },
    verified: { bg: '#CCFBF1', text: '#0F766E', border: '#99F6E4' },
    clarification: { bg: '#FFFBEB', text: '#B45309', border: '#FDE68A' },
    processing: { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE' },
    error: { bg: '#FEF2F2', text: '#B91C1C', border: '#FECACA' },
  },
} as const;

export type StatusKey = keyof typeof colors.status;
