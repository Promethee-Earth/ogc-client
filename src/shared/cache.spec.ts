import {
  _resetCache,
  clearCache,
  getCache,
  purgeOutdatedEntries,
  readCacheEntry,
  setCacheExpiryDuration,
  storeCacheEntry,
  useCache,
} from './cache.js';

const factory = jest.fn(() => ({ fresh: true }));
let NOW;
Date.now = () => NOW;

describe('cache utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setCacheExpiryDuration(1000);
  });

  describe('cache API is available', () => {
    beforeEach(async () => {
      // clear all cache entries
      NOW = 50000;
      await purgeOutdatedEntries();
      // set start time
      NOW = 10000;
    });
    describe('useCache', () => {
      describe('when no cache entry is present', () => {
        let result;
        beforeEach(async () => {
          result = await useCache(factory, 'test', 'entry', '01');
        });
        it('runs the factory function', () => {
          expect(factory).toHaveBeenCalledTimes(1);
        });
        it('returns the produced object', () => {
          expect(result).toEqual({ fresh: true });
        });
      });
      describe('when an expired cache entry is present', () => {
        let result;
        beforeEach(async () => {
          await storeCacheEntry({ old: true }, 'test', 'entry', '02');
          NOW = 12000;
          result = await useCache(factory, 'test', 'entry', '02');
        });
        it('runs the factory function', () => {
          expect(factory).toHaveBeenCalledTimes(1);
        });
        it('returns the produced object', () => {
          expect(result).toEqual({ fresh: true });
        });
      });
      describe('when a valid cache entry is present', () => {
        let result;
        beforeEach(async () => {
          await storeCacheEntry({ old: true }, 'test', 'entry', '03');
          NOW = 10800;
          result = await useCache(factory, 'test', 'entry', '03');
        });
        it('does not run the factory function', () => {
          expect(factory).not.toHaveBeenCalled();
        });
        it('returns the cached object', () => {
          expect(result).toEqual({ old: true });
        });
      });
      describe('when no cache entry is present but a similar task is already running', () => {
        let result, longTask, produced;
        beforeEach(async () => {
          produced = { long: Math.random() };
          longTask = jest.fn(
            () =>
              new Promise((resolve) => {
                setTimeout(() => {
                  resolve(produced);
                }, 10);
              })
          );
          useCache(longTask, 'test', 'entry', '04');
          result = await useCache(longTask, 'test', 'entry', '04');
        });
        it('does not run the factory function again', () => {
          expect(longTask).toHaveBeenCalledTimes(1);
        });
        it('returns the object from the existing run', () => {
          expect(result).toBe(produced);
        });
      });
      describe('when an expired cache entry is present (as well as unrelated entries) and a new cache entry is set', () => {
        beforeEach(async () => {
          await storeCacheEntry({ old: true }, 'test', 'entry', '04');
          NOW = 11200;
          await storeCacheEntry({ unrelated: true }, 'unrelated');
          await useCache(factory, 'test', 'entry', '05');
        });
        it('deletes the expired cache entry', async () => {
          await expect(
            readCacheEntry('test', 'entry', '04')
          ).resolves.toBeNull();
        });
        it('preserves unrelated entry', async () => {
          await expect(readCacheEntry('unrelated')).resolves.toEqual({
            unrelated: true,
          });
        });
      });
    });
    describe('clearCache', () => {
      let result;
      beforeEach(async () => {
        await storeCacheEntry({ old: true }, 'test', 'entry', '03');
        NOW = 10800;
        await clearCache();
        result = await useCache(factory, 'test', 'entry', '03');
      });
      it('do not use the cached function object', () => {
        expect(factory).toHaveBeenCalled();
        expect(result).toEqual({ fresh: true });
      });
    });
  });

  describe('when the Cache API is not available', () => {
    let result;
    let originalCache;
    beforeEach(async () => {
      _resetCache();
      originalCache = globalThis.caches;
      delete globalThis.caches;
      await storeCacheEntry({ old: true }, 'test', 'entry', '06');
      result = await useCache(factory, 'test', 'entry', '06');
    });
    afterEach(() => {
      globalThis.caches = originalCache;
    });
    it('runs the factory function', () => {
      expect(factory).toHaveBeenCalledTimes(1);
    });
    it('does not use cache, does not fail', () => {
      expect(result).toEqual({ fresh: true });
    });
  });

  describe('when the Cache API is available but blocked for security reasons', () => {
    let result;
    let originalFn;
    beforeEach(async () => {
      _resetCache();
      originalFn = globalThis.caches.open;
      globalThis.caches.open = () => Promise.reject(new Error('not allowed'));
      await storeCacheEntry({ old: true }, 'test', 'entry', '07');
      result = await useCache(factory, 'test', 'entry', '07');
    });
    afterEach(() => {
      globalThis.caches.open = originalFn;
    });
    it('runs the factory function', () => {
      expect(factory).toHaveBeenCalledTimes(1);
    });
    it('does not use cache, does not fail', () => {
      expect(result).toEqual({ fresh: true });
    });
  });

  describe('when the Cache API is available but fails on put()', () => {
    let result;
    beforeEach(async () => {
      _resetCache();
      const cache = await getCache();
      cache.put = () => Promise.reject(new Error('something went wrong'));
      await storeCacheEntry({ old: true }, 'test', 'entry', '08');
      await storeCacheEntry({ old: true }, 'test', 'entry', '09');
      await storeCacheEntry({ old: true }, 'test', 'entry', '10');
      result = await useCache(factory, 'test', 'entry', '08');
      result = await useCache(factory, 'test', 'entry', '09');
      result = await useCache(factory, 'test', 'entry', '10');
    });
    it('runs the factory function', () => {
      expect(factory).toHaveBeenCalledTimes(3);
    });
    it('does not use cache, does not fail', () => {
      expect(result).toEqual({ fresh: true });
    });
  });
});
