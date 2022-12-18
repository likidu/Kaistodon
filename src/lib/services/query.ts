import { useQuery } from '@sveltestack/svelte-query';
import { login } from 'masto';

const masto = await login({
  url: 'https://m.cmx.im',
  accessToken: 'fM-4XXGcYHkJfAN7mM0Ap2OnX79UozEzjf7jd8ReXnY',
});

export const usePublicTimeline = () =>
  useQuery(['timeline'], async () => {
    return await masto.timelines.fetchPublic({
      limit: 30,
    });
  });
