import type { Token } from '@/lib/models';
import { Storage } from '@/ui/services';
import { writable } from 'svelte/store';

/**
 * @summary Create store for user and tokens and save them to LocalStorage
 * @param key
 * @param initStore
 * @returns Store<T>
 */
function createStore<T>(key: 'auth', initStore: T, itemKey: string) {
  const { subscribe, update, set } = writable<T>(initStore);

  subscribe((val) => {
    Storage.setItem(key, val, itemKey);
  });

  return {
    subscribe,
    update: function (data: T) {
      update((previous) => ({ ...previous, ...data }));
    },
    reset: function () {
      set(null);
    },
  };
}

const storedTokens = Storage.get<Token>('auth');
export const tokens = createStore<Token>('auth', storedTokens, 'instance');
