export const colors = {
  void: '#070B12',
  surface: '#0F1623',
  surfaceElevated: '#162032',
  surfaceHighlight: '#1E2A3D',
  border: '#243044',
  borderFocus: '#14F5D0',

  primary: '#14F5D0',
  primaryDim: '#0D9488',
  primaryGlow: 'rgba(20, 245, 208, 0.15)',

  accent: '#7C6CFF',
  accentDim: 'rgba(124, 108, 255, 0.15)',

  warning: '#FBBF24',
  warningDim: 'rgba(251, 191, 36, 0.15)',

  danger: '#F87171',
  dangerDim: 'rgba(248, 113, 113, 0.15)',

  success: '#34D399',
  successDim: 'rgba(52, 211, 153, 0.15)',

  text: '#F1F5F9',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',

  white: '#FFFFFF',
  black: '#000000',
} as const;

export type ColorKey = keyof typeof colors;
