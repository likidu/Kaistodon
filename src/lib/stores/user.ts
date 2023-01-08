import type { Token } from '@/lib/models';
import { Storage } from '@/ui/services';
import { writable } from 'svelte/store';

/**
 * @summary Create store for user and tokens and save them to LocalStorage
 * @param key
 * @param initStore
 * @returns Store<T>
 */
function createStore<T>(key: 'user' | 'auth', initStore: T) {
  const { subscribe, update, set } = writable<T>(initStore);

  subscribe((val) => {
    Storage.set(key, val);
  });

  return {
    subscribe,
    update: function (data: Partial<T>) {
      update((previous) => ({ ...previous, ...data }));
    },
    reset: function () {
      set(null);
    },
  };
}

const storedToken = Storage.get<Token>('auth');
export const token = createStore<Token>('auth', storedToken);
