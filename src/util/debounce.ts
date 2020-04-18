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

/* class Debouncer {
  constructor (cb, delay = 500, context) {
      let timeout = null

      // If there is a context provided (this), bind the callback to it
      let finalCb = context ? cb.bind(context) : cb

      this.reset = () => {
          clearTimeout(timeout)

          timeout = window.setTimeout(finalCb, delay)
      }

      this.force = () => {
          clearTimeout(timeout)

          finalCb()
      }
  }
} */
