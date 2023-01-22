import { get, writable } from 'svelte/store';

import { Storage } from '@/ui/services';

import { addOrReplace } from '@/lib/helpers';
import type { Token } from '@/lib/models';
import { settings } from '@/lib/stores';

/**
 * @summary Create store for user and tokens and save them to LocalStorage
 * @param key
 * @param initStore
 * @returns Store<T>
 */
function createStore() {
  const initStore = storedTokens ? storedTokens : [initToken];
  const { subscribe, update, set } = writable(initStore);

  subscribe((val) => {
    Storage.set(storageKey, val);
  });

  return {
    subscribe,
    update: function (data: Token) {
      // update((previous) => ({ ...previous, ...data }));
      update((previous) => addOrReplace(previous, 'instance', data));
    },
    reset: function () {
      set(null);
    },
  };
}

const storageKey = 'auth';

// Initialize tokens store
const { instance } = get(settings);
const initToken: Token = {
  instance,
  token: '',
};

const storedTokens = Storage.get<Token[]>(storageKey);

export const tokens = createStore();

export const getCurrentToken = () => get(tokens).find((t) => t.instance === get(settings).instance);
