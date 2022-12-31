import type { ThemeConfig } from '@/ui/models';
import { themes as baseThemes } from '@/ui/themes';

export const themes: ThemeConfig[] = [
  ...baseThemes,
  {
    id: 'cosmos',
    values: {
      cardColorH: 0,
      cardColorS: 0,
      cardColorL: 100,

      accentColorH: 240,
      accentColorS: 100,
      accentColorL: 67,

      textColorH: 0,
      textColorS: 0,
      textColorL: 0,

      focusColorA: 7,
      dividerColorA: 10,
    },
  },
];
