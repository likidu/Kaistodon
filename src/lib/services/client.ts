import { login } from 'masto';
import { get } from 'svelte/store';

import { settings, tokens } from '@/lib/stores';

const { instance, token } = get(tokens).find((t) => t.instance === get(settings).instance);

export const masto = await login({
  url: `https://${instance}`,
  // accessToken: 'fM-4XXGcYHkJfAN7mM0Ap2OnX79UozEzjf7jd8ReXnY',
  ...(token && { accessToken: token }),
});
