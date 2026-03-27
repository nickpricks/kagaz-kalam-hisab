import { beforeEach, describe, expect, it } from 'vitest';
import { saveToStorage, getFromStorage } from '../utils/localStorage';


describe("localStorage Utilities", () => {
  let storage: Record<string, string>;

  beforeEach(() => {
    storage = {};
    const mockWindow = {
      localStorage: {
        getItem: (key: string) => storage[key] ?? null,
        setItem: (key: string, value: string) => { storage[key] = value; },
        removeItem: (key: string) => { delete storage[key]; },
      }
    };
    Object.defineProperty(globalThis, 'window', { value: mockWindow, writable: true, configurable: true });
  });

  describe("saveToStorage", () => {
    it("should save and retrieve a string", () => {
      saveToStorage("key", "hello");
      expect(storage["key"]).toBe('"hello"');
    });

    it("should save an object as JSON", () => {
      saveToStorage("obj", { a: 1, b: "two" });
      expect(JSON.parse(storage["obj"])).toEqual({ a: 1, b: "two" });
    });

    it("should save an array", () => {
      saveToStorage("arr", [1, 2, 3]);
      expect(JSON.parse(storage["arr"])).toEqual([1, 2, 3]);
    });

    it("should overwrite existing keys", () => {
      saveToStorage("key", "first");
      saveToStorage("key", "second");
      expect(JSON.parse(storage["key"])).toBe("second");
    });

    it("should not throw on save failure", () => {
      const brokenWindow = {
        localStorage: {
          getItem: () => null,
          setItem: () => { throw new Error("QuotaExceededError"); },
        }
      };
      Object.defineProperty(globalThis, 'window', { value: brokenWindow, writable: true, configurable: true });
      expect(() => saveToStorage("key", "value")).not.toThrow();
    });
  });

  describe("getFromStorage", () => {
    it("should return parsed value when key exists", () => {
      storage["key"] = JSON.stringify({ x: 42 });
      expect(getFromStorage("key", null)).toEqual({ x: 42 });
    });

    it("should return default when key does not exist", () => {
      expect(getFromStorage("missing", "default")).toBe("default");
    });

    it("should return default array when key does not exist", () => {
      expect(getFromStorage("missing", [])).toEqual([]);
    });

    it("should return default on corrupted JSON", () => {
      storage["bad"] = "not valid json{{{";
      expect(getFromStorage("bad", "fallback")).toBe("fallback");
    });

    it("should not throw on read failure", () => {
      const brokenWindow = {
        localStorage: {
          getItem: () => { throw new Error("SecurityError"); },
        }
      };
      Object.defineProperty(globalThis, 'window', { value: brokenWindow, writable: true, configurable: true });
      expect(() => getFromStorage("key", "safe")).not.toThrow();
      expect(getFromStorage("key", "safe")).toBe("safe");
    });
  });
});
