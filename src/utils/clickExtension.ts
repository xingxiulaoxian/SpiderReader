export default (
  callback: (...rest: any) => void,
  count: number = 2,
  timeout: number = 300,
) => {
  let times = 0;
  let timer: NodeJS.Timeout | null = null;
  // 模仿双击事件
  return (...arg: any) => {
    timer !== null && clearTimeout(timer);
    if (++times >= count) {
      times = 0;
      // 把要执行的事件写在这
      callback(...arg);
    }
    timer = setTimeout(() => {
      times = 0;
    }, timeout);
  };
};