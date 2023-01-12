import { useQuery } from '@sveltestack/svelte-query';
import { get } from 'svelte/store';

import { masto } from './masto';

/**
 * User profile
 * @returns AccountCredentials
 */
export const useUserProfile = () =>
  useQuery(
    ['user-profile'],
    async () => {
      return await get(masto).v1.accounts.verifyCredentials();
    },
    {
      staleTime: 15 * 60 * 1000,
    },
  );
