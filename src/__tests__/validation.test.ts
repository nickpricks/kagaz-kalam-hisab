import { describe, it, expect } from "vitest";
import { validateImportData } from "../utils/validation";


describe("Validation Logic", () => {
  it("should validate correct data", () => {
    const data = [
      { date: "2024-03-16", category: "food", amount: 100 }
    ];
    const result = validateImportData(data);
    expect(result.isValid).toBe(true);
  });

  it("should fail on missing fields", () => {
    const data = [{ date: "2024-03-16", category: "food" }];
    const result = validateImportData(data);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("missing mandatory fields");
  });

  it("should fail on invalid date format", () => {
    const data = [{ date: "16-03-2024", category: "food", amount: 100 }];
    const result = validateImportData(data);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("invalid date format");
  });

  it("should fail on unknown category", () => {
    const data = [{ date: "2024-03-16", category: "unknown", amount: 100 }];
    const result = validateImportData(data);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("unknown category");
  });
});
