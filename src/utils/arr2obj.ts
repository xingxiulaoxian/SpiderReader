function arr2obj<T>(arr: T[], key: keyof T): Map<string, T> {
  return arr.reduce((acc, curr) => {
    acc.set(`${curr[key]}`, curr);
    return acc;
  }, new Map());
}

export default arr2obj;
