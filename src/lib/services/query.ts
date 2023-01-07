import { useQuery } from '@sveltestack/svelte-query';
import type { mastodon } from 'masto';

import { client } from './client';

/**
 * @returns AccountCredentials
 */
export const useUserProfile = () =>
  useQuery(
    ['user-profile'],
    async () => {
      return await client.v1.accounts.verifyCredentials();
    },
    {
      staleTime: 15 * 60 * 1000,
    },
  );

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
