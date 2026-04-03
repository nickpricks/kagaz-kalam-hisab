import { describe, expect, it } from 'vitest';
import { CATEGORIES, getCategoryById, getAllCategoryIds, getSubCategories } from '../data/categories';


describe("Categories", () => {
  describe("CATEGORIES", () => {
    it("should have at least 5 categories", () => {
      expect(Object.keys(CATEGORIES).length).toBeGreaterThanOrEqual(5);
    });

    it("should include food, bills, and misc", () => {
      expect(CATEGORIES.food).toBeDefined();
      expect(CATEGORIES.bills).toBeDefined();
      expect(CATEGORIES.misc).toBeDefined();
    });

    it("should have matching id and key for each category", () => {
      for (const [key, cat] of Object.entries(CATEGORIES)) {
        expect(cat.id).toBe(key);
      }
    });
  });

  describe("getCategoryById", () => {
    it("should return the category for a valid id", () => {
      const cat = getCategoryById("food");
      expect(cat).toBeDefined();
      expect(cat!.label).toContain("Food");
    });

    it("should return undefined for an unknown id", () => {
      expect(getCategoryById("nonexistent")).toBeUndefined();
    });
  });

  describe("getAllCategoryIds", () => {
    it("should return an array of all category keys", () => {
      const ids = getAllCategoryIds();
      expect(ids).toContain("food");
      expect(ids).toContain("misc");
      expect(ids.length).toBe(Object.keys(CATEGORIES).length);
    });
  });

  describe("getSubCategories", () => {
    it("should return subcategories for food", () => {
      const subs = getSubCategories("food");
      expect(subs.length).toBeGreaterThan(0);
      expect(subs).toContain("Milk");
    });

    it("should return subcategories for misc", () => {
      expect(getSubCategories("misc")).toEqual(["Misc"]);
    });

    it("should return empty array for unknown category", () => {
      expect(getSubCategories("nonexistent")).toEqual([]);
    });
  });
});
