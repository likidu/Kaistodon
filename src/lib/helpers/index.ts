export const addOrReplace = <T>(arr: T[], key: string, newObj: T) => [
  ...arr.filter((o) => o[key] !== newObj[key]),
  { ...newObj },
];
