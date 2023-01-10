import { Storage } from '@/ui/services';

import type { Token } from '@/lib/models';
import { settings } from '@/lib/stores';

import { get, writable } from 'svelte/store';

/**
 * @summary Create store for user and tokens and save them to LocalStorage
 * @param key
 * @param initStore
 * @returns Store<T>
 */
function createStore<T>(initStore: T[]) {
  const { subscribe, update, set } = writable<T[]>(initStore);

  subscribe((val) => {
    Storage.setItem(storageKey, val, itemKey);
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

// const addOrReplace = (arr, newObj) => [...arr.filter((o) => o.uid !== newObj.uid), {...newObj}];
const storageKey = 'auth';

const { instance } = get(settings);
const initToken: Token = {
  instance,
  token: '',
};
const storedTokens = Storage.get<Token[]>(storageKey);
const initStore = [...storedTokens.filter((o) => o.instance !== initToken.instance), { ...initToken }];
export const tokens = createStore<Token>(initStore);
