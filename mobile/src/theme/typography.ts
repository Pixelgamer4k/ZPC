import { TextStyle } from 'react-native';

export const typography = {
  hero: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  } as TextStyle,
  title: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: -0.3,
  } as TextStyle,
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
  } as TextStyle,
  body: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
  } as TextStyle,
  caption: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  } as TextStyle,
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  } as TextStyle,
  mono: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'monospace',
  } as TextStyle,
} as const;
