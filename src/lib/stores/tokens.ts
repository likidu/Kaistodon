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
  const storedTokens = Storage.get<Token[]>(storageKey);

  const initStore = storedTokens ? addOrReplace(storedTokens, 'instance', initToken) : [initToken];
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

// const addOrReplace = (arr, newObj) => [...arr.filter((o) => o.uid !== newObj.uid), {...newObj}];
const storageKey = 'auth';

// Initialize
const { instance } = get(settings);
const initToken: Token = {
  instance,
  token: '',
};

export const tokens = createStore();
