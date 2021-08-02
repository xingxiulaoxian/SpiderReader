function diffMap(
  map1: Map<string, any>,
  map2: Map<string, any>,
): Map<string, any> {
  for (const [key] of map1) {
    if (map1.get(key) === map2.get(key)) {
      map1.delete(key);
      map2.delete(key);
    }
  }
  return new Map([...map1, ...map2]);
}

export default diffMap;
