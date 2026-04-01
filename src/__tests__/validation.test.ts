import { describe, it, expect } from "vitest";
import { validateImportData } from "../utils/validation";


describe("Validation Logic", () => {
  it("should validate correct data", () => {
    const data = [{ date: "2024-03-16", category: "food", amount: 100 }];
    expect(validateImportData(data).isValid).toBe(true);
  });

  it("should validate multiple valid items", () => {
    const data = [
      { date: "2024-03-16", category: "food", amount: 100 },
      { date: "2024-03-17", category: "bills", amount: 500 },
    ];
    expect(validateImportData(data).isValid).toBe(true);
  });

  it("should pass with valid optional fields present", () => {
    const data = [{ date: "2024-03-16", category: "food", amount: 100, note: "test", subCat: "Milk" }];
    expect(validateImportData(data).isValid).toBe(true);
  });

  it("should accept an empty array", () => {
    expect(validateImportData([]).isValid).toBe(true);
  });

  // Non-array inputs
  it("should fail on non-array input (object)", () => {
    const result = validateImportData({ date: "2024-03-16" });
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("array");
  });

  it("should fail on non-array input (string)", () => {
    expect(validateImportData("not an array").isValid).toBe(false);
  });

  it("should fail on non-array input (null)", () => {
    expect(validateImportData(null).isValid).toBe(false);
  });

  // Missing fields
  it("should fail on missing date", () => {
    const result = validateImportData([{ category: "food", amount: 100 }]);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("missing mandatory fields");
  });

  it("should fail on missing category", () => {
    const result = validateImportData([{ date: "2024-03-16", amount: 100 }]);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("missing mandatory fields");
  });

  it("should fail on missing amount", () => {
    const result = validateImportData([{ date: "2024-03-16", category: "food" }]);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("missing mandatory fields");
  });

  // Date format
  it("should fail on invalid date format (DD-MM-YYYY)", () => {
    const result = validateImportData([{ date: "16-03-2024", category: "food", amount: 100 }]);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("invalid date format");
  });

  it("should fail on date with slashes", () => {
    const result = validateImportData([{ date: "2024/03/16", category: "food", amount: 100 }]);
    expect(result.isValid).toBe(false);
  });

  it("should fail on semantically invalid date (Feb 30)", () => {
    const result = validateImportData([{ date: "2024-02-30", category: "food", amount: 100 }]);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("invalid date");
  });

  it("should fail on semantically invalid date (month 13)", () => {
    const result = validateImportData([{ date: "2024-13-01", category: "food", amount: 100 }]);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("invalid date");
  });

  it("should accept a valid leap year date", () => {
    const result = validateImportData([{ date: "2024-02-29", category: "food", amount: 100 }]);
    expect(result.isValid).toBe(true);
  });

  it("should fail on Feb 29 in non-leap year", () => {
    const result = validateImportData([{ date: "2023-02-29", category: "food", amount: 100 }]);
    expect(result.isValid).toBe(false);
  });

  // Category
  it("should fail on unknown category", () => {
    const result = validateImportData([{ date: "2024-03-16", category: "unknown", amount: 100 }]);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("unknown category");
  });

  // Amount edge cases
  it("should fail on zero amount", () => {
    const result = validateImportData([{ date: "2024-03-16", category: "food", amount: 0 }]);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("invalid amount");
  });

  it("should fail on negative amount", () => {
    const result = validateImportData([{ date: "2024-03-16", category: "food", amount: -50 }]);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("invalid amount");
  });

  it("should fail on string amount", () => {
    const result = validateImportData([{ date: "2024-03-16", category: "food", amount: "100" }]);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("invalid amount");
  });

  // Error index reporting
  it("should report the correct index of the failing item", () => {
    const data = [
      { date: "2024-03-16", category: "food", amount: 100 },
      { date: "2024-03-17", category: "food", amount: -5 },
    ];
    const result = validateImportData(data);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("index 1");
  });
});
