import { searchOptionSchema, optionalNumber, simpleOptionalNumber } from "../common/schemaUtils";

describe("Schema Utils", () => {
  describe("searchOptionSchema", () => {
    it("should validate correct search option object", () => {
      const validData = { title: "Test Title", id: "test-id" };
      const result = searchOptionSchema.parse(validData);
      expect(result).toEqual(validData);
    });

    it("should reject invalid search option object", () => {
      expect(() => searchOptionSchema.parse({ title: "Test" })).toThrow();
      expect(() => searchOptionSchema.parse({ id: "test" })).toThrow();
      expect(() => searchOptionSchema.parse({})).toThrow();
    });
  });

  describe("optionalNumber", () => {
    it("should convert valid string numbers to integers", () => {
      expect(optionalNumber.parse("100")).toBe(100);
      expect(optionalNumber.parse("0")).toBe(0);
      expect(optionalNumber.parse("1000")).toBe(1000);
    });

    it("should handle empty values as undefined", () => {
      expect(optionalNumber.parse("")).toBeUndefined();
      expect(optionalNumber.parse(null)).toBeUndefined();
      expect(optionalNumber.parse(undefined)).toBeUndefined();
      expect(optionalNumber.parse("   ")).toBeUndefined();
    });

    it("should handle valid numbers directly", () => {
      expect(optionalNumber.parse(100)).toBe(100);
      expect(optionalNumber.parse(0)).toBe(0);
    });

    it("should handle invalid strings as undefined", () => {
      expect(optionalNumber.parse("abc")).toBeUndefined();
      expect(optionalNumber.parse("100abc")).toBeUndefined();
    });

    it("should reject negative numbers", () => {
      expect(() => optionalNumber.parse(-1)).toThrow();
      expect(() => optionalNumber.parse("-5")).toThrow();
    });

    it("should reject decimal numbers", () => {
      expect(() => optionalNumber.parse(10.5)).toThrow();
      expect(() => optionalNumber.parse("10.5")).toThrow();
    });
  });

  describe("simpleOptionalNumber", () => {
    it("should convert valid string numbers to integers", () => {
      expect(simpleOptionalNumber.parse("100")).toBe(100);
      expect(simpleOptionalNumber.parse("0")).toBe(0);
      expect(simpleOptionalNumber.parse("1000")).toBe(1000);
    });

    it("should handle empty values as undefined", () => {
      expect(simpleOptionalNumber.parse("")).toBeUndefined();
      expect(simpleOptionalNumber.parse(null)).toBeUndefined();
      expect(simpleOptionalNumber.parse(undefined)).toBeUndefined();
    });

    it("should handle valid numbers directly", () => {
      expect(simpleOptionalNumber.parse(100)).toBe(100);
      expect(simpleOptionalNumber.parse(0)).toBe(0);
    });

    it("should convert invalid strings to NaN, then to undefined", () => {
      expect(simpleOptionalNumber.parse("abc")).toBeUndefined();
      expect(simpleOptionalNumber.parse("100abc")).toBeUndefined();
    });

    it("should reject negative numbers", () => {
      expect(() => simpleOptionalNumber.parse(-1)).toThrow();
      expect(() => simpleOptionalNumber.parse("-5")).toThrow();
    });
  });
}); 