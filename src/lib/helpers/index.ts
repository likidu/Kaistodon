export const addOrReplace = <T>(arr: [], key: string, newObj: T) => [
  ...arr.filter((o) => o[key] !== newObj[key]),
  { ...newObj },
];
