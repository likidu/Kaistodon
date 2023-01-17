import type { ThemeConfig } from '@/ui/models';
import { themes as baseThemes } from '@/ui/themes';

export const themes: ThemeConfig[] = [
  ...baseThemes,
  {
    id: 'mastodon-light',
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
  {
    id: 'mastodon-dark',
    values: {
      cardColorH: 0,
      cardColorS: 0,
      cardColorL: 15,

      accentColorH: 240,
      accentColorS: 100,
      accentColorL: 67,

      textColorH: 0,
      textColorS: 0,
      textColorL: 100,

      focusColorA: 20,
      dividerColorA: 10,
    },
  },
];
