import { logger } from '@/util/index';

/**
 * Any function that generates a promise given a piece of data.
 */
type PromiseGenerator<D> = (data: D) => Promise<any>;

type EqualityTest<D> = (oldData: D, newData: D) => boolean;

const strictEquality: EqualityTest<any> = (oldKey, newKey) => oldKey === newKey;

/**
 * Provides a managed wrapper for request calls,
 * exposing various flags for status and
 * providing for idempotent requests by key
 */
export default class RequestManager<K> {
  cb: PromiseGenerator<K>;

  inProgress: boolean = false;

  promiseFulfilled: boolean = false;

  currentKey?: K;

  keyCompareFn!: EqualityTest<K>;

  promise?: Promise<any>;

  /**
   * @param cb - function that takes in some data and returns a promise
   * @param keyCompareFn - function that compares data with previous request
   * data and determines if they match, and then ignores consecutive invokations
   * until existing requests complete. Default is oldData === newData
   */
  constructor(
    cb: PromiseGenerator<K>,
    keyCompareFn: EqualityTest<K> = strictEquality,
  ) {
    this.cb = cb;
    this.keyCompareFn = keyCompareFn;
  }

  request(key: K, force: boolean = false) {
    if (!this.currentKey || !this.keyCompareFn(this.currentKey, key)) {
      this.promiseFulfilled = false;
    }

    if (!this.promiseFulfilled || force) {
      this.currentKey = key;

      this.inProgress = true;

      this.promise = this.cb(key)
        .then((result) => {
          this.promiseFulfilled = true;

          return result;
        })
        .finally(() => {
          this.inProgress = false;
        });
    }

    return this.promise!;
  }
}
