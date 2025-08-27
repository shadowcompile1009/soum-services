//https://github.com/nestjs/passport/blob/master/lib/utils/memoize.util.ts
const defaultKey = 'default';

export function memoize(fn: (...args: unknown[]) => unknown) {
  const cache = {};
  return (...args) => {
    const n = args[0] || defaultKey;
    if (n in cache) {
      return cache[n];
    } else {
      const result = fn(n === defaultKey ? undefined : n);
      cache[n] = result;
      return result;
    }
  };
}
