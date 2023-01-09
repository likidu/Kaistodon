type StorageKey = 'settings' | 'user' | 'auth';

export class Storage {
  static get<T>(key: StorageKey): T {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  static set<T>(key: StorageKey, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  static setItem<T>(key: StorageKey, value: T, itemKey: string): void {
    const data = JSON.parse(localStorage.getItem(key));
    if (data && Array.isArray(data)) {
      const items = Array.from(data);
      items.forEach((item, idx) => {
        // Replace the item if there is existing itemKey
        if (item[itemKey] === value[itemKey]) items[idx] = value;
        // Otherwise add value as new item
        else items.push(value);
      });
      localStorage.setItem(key, JSON.stringify(items));
    }
  }
}
