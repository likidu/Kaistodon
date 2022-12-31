import { useQuery } from '@sveltestack/svelte-query';
import type { Status } from 'masto';
import { login } from 'masto';

const masto = await login({
  url: 'https://m.cmx.im',
  accessToken: 'fM-4XXGcYHkJfAN7mM0Ap2OnX79UozEzjf7jd8ReXnY',
});

/**
 * @param local: Only show local timeline, like most Mastodon client did
 * @param limit: # of items returns
 * @returns
 */
export const usePublicTimeline = () =>
  useQuery<Status[], Error>(['timeline'], async () => {
    return await masto.v1.timelines.listPublic({
      local: true,
      limit: 10,
    });
  });

/**
 * @param limit: # of items returns
 * @returns
 */
export const useTrendStatus = () =>
  useQuery<Status[], Error>(['trend-status'], async () => {
    return await masto.v1.trends.listStatuses({
      limit: 10,
    });
  });
