import type { mastodon } from 'masto';
import { login } from 'masto';
import type { Readable } from 'svelte/store';
import { derived } from 'svelte/store';

import type { Settings, Token } from '@/lib/models';
import { getCurrentInstance, getCurrentToken, settings, tokens } from '@/lib/stores';

export const masto = derived<[Readable<Settings>, Readable<Token[]>], mastodon.Client>(
  [settings, tokens],
  ([$settings, $tokens], set) => {
    const { url } = getCurrentInstance();
    const { token } = getCurrentToken();
    console.log('[masto.ts]: Masto store get token: ', token);

    const client = login({
      url: `https://${url}`,
      // accessToken: 'fM-4XXGcYHkJfAN7mM0Ap2OnX79UozEzjf7jd8ReXnY',
      ...(token && { accessToken: token }),
    });

    client.then((value) => set(value));
  },
);

// export const masto = derived([settings, tokens], async ([$settings, $tokens]): Promise<mastodon.Client> => {
//   const { instance, token } = $tokens.find((t) => t.instance === $settings.instance);
//   console.log('[masto.ts]: Masto store get token: ', token);

//   const client = await login({
//     url: `https://${instance}`,
//     // accessToken: 'fM-4XXGcYHkJfAN7mM0Ap2OnX79UozEzjf7jd8ReXnY',
//     ...(token && { accessToken: token }),
//   });
//   return client;
// });
