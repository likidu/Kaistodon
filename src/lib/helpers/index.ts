/**
 * Add or replace a new object in an array
 * @param arr Origin array
 * @param key Individual object key in array for comparing
 * @param newObj New object to add or replace in the array
 * @returns Updated array
 */
export const addOrReplace = <T>(arr: T[], key: string, newObj: T) => [
  ...arr.filter((o) => o[key] !== newObj[key]),
  { ...newObj },
];
