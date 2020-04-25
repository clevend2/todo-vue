export const logger: Console = new Proxy(window.console, {});

// /**
//  * A adapter of a Map that allows object keys to be hashed into a string
//  * using a callback so uniqueness or lack thereof can be maintained in a black box api
//  */
// export class HashedKeyMap<K, V> implements Map<K, V> {
//   map: Map<K, V>;

//   hashFn: (k: K) => any;

//   constructor(hashFn: (k: K) => any, entries?: readonly (readonly [K, V])[] | null) {
//     this.map = new Map(entries);
//     this.hashFn = hashFn;
//   }

//   clear(): void {
//     this.map.clear();
//   }

//   delete(key: K): boolean {
//     return this.map.delete(this.hashFn(key));
//   }

//   get(key: K): V | undefined {
//     return this.map.get(this.hashFn(key));
//   }

//   has(key: K): boolean {
//     return this.map.has(this.hashFn(key));
//   }

//   set(key: K, value: V): this {
//     this.map.set(this.hashFn(key), value);

//     return this;
//   }

//   forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void {
//     logger.warn('HashedKeyMap::forEach: keys are returned in hashed form');
//     return this.map.forEach(callbackfn, thisArg);
//   }

//   get size() {
//     return this.map.size;
//   }

//   /* eslint-disable class-methods-use-this */
//   get [Symbol.toStringTag]() {
//     return 'HashedKeyMap';
//   }
//   /* eslint-enable class-methods-use-this */

//   get [Symbol.iterator]() {
//     logger.warn('HashedKeyMap::iterator: keys are returned in hashed form');
//     return this.map[Symbol.iterator];
//   }

//   entries() {
//     logger.warn('HashedKeyMap::entries: keys are returned in hashed form');
//     return this.map.entries();
//   }

//   keys() {
//     logger.warn('HashedKeyMap::keys: keys are returned in hashed form');
//     return this.map.keys();
//   }

//   values() {
//     return this.map.values();
//   }
// }

const readOnlyNoop = (...args: any[]) => {
  logger.log('Map is read only!');
};

/* eslint-disable no-param-reassign */
export const makeMapReadOnly = (map: Map<any, any>): Map<any, any> => {
  map.clear = readOnlyNoop;

  map.delete = (k) => {
    readOnlyNoop();

    return false;
  };

  map.set = (k, v) => {
    readOnlyNoop();
    return map;
  };

  return map;
};
/* eslint-enable no-param-reassign */

export const notify = (message: string, type: string = 'notice') => {
  // stub
  logger.log(message);
};
