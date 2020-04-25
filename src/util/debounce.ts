export default (fn: Function, t = 500) => {
  let timeout: number;
  return function debouncedFn(...args: any[]) {
    const deferred = () => {
      fn(...args);
    };

    if (timeout) {
      window.clearTimeout(timeout);
    }

    timeout = window.setTimeout(deferred, t);
  };
};
