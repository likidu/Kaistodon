import { useQuery } from '@sveltestack/svelte-query';
import type { mastodon } from 'masto';

import { client } from './client';

/**
 * @param local: Only show local timeline, like most Mastodon client did
 * @param limit: # of items returns
 * @returns
 */
export const usePublicTimeline = () =>
  useQuery<mastodon.v1.Status[], Error>(
    ['timeline'],
    async () => {
      return await client.v1.timelines.listPublic({
        local: true,
        limit: 10,
      });
    },
    { staleTime: 5 * 60 * 1000 },
  );

/**
 * @param limit: # of items returns
 * @returns
 */
export const useTrendStatus = () =>
  useQuery<mastodon.v1.Status[], Error>(
    ['trend-status'],
    async () => {
      return await client.v1.trends.listStatuses({
        limit: 10,
      });
    },
    { staleTime: 5 * 60 * 1000 },
  );
