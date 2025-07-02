import { parseHeadcount, formatHeadcount } from '../parsedHeadcount';

describe('parseHeadcount', () => {
  describe('string inputs', () => {
    it('should parse plain numbers', () => {
      expect(parseHeadcount('100')).toBe(100);
      expect(parseHeadcount('0')).toBe(0);
      expect(parseHeadcount('1')).toBe(1);
    });

    it('should parse K suffix numbers', () => {
      expect(parseHeadcount('1K')).toBe(1000);
      expect(parseHeadcount('2.5K')).toBe(2500);
      expect(parseHeadcount('10K')).toBe(10000);
    });

    it('should parse M suffix numbers', () => {
      expect(parseHeadcount('1M')).toBe(1000000);
      expect(parseHeadcount('2.5M')).toBe(2500000);
      expect(parseHeadcount('10M')).toBe(10000000);
    });

    it('should handle case insensitive suffixes', () => {
      expect(parseHeadcount('1k')).toBe(1000);
      expect(parseHeadcount('1m')).toBe(1000000);
    });

    it('should handle + suffix', () => {
      expect(parseHeadcount('100+')).toBe(100);
      expect(parseHeadcount('1K+')).toBe(1000);
    });

    it('should handle whitespace', () => {
      expect(parseHeadcount(' 100 ')).toBe(100);
      expect(parseHeadcount(' 1K ')).toBe(1000);
    });

    it('should return 0 for invalid strings', () => {
      expect(parseHeadcount('')).toBe(0);
      expect(parseHeadcount('abc')).toBe(0);
      expect(parseHeadcount('1X')).toBe(0);
      expect(parseHeadcount('invalid')).toBe(0);
    });
  });

  describe('number inputs', () => {
    it('should return the number as-is for valid numbers', () => {
      expect(parseHeadcount(100)).toBe(100);
      expect(parseHeadcount(0)).toBe(0);
      expect(parseHeadcount(1000)).toBe(1000);
      expect(parseHeadcount(2500000)).toBe(2500000);
    });

    it('should handle edge cases', () => {
      expect(parseHeadcount(0)).toBe(0);
    });
  });

  describe('edge cases', () => {
    it('should return 0 for null/undefined', () => {
      expect(parseHeadcount(null as any)).toBe(0);
      expect(parseHeadcount(undefined as any)).toBe(0);
    });
  });
});

describe('formatHeadcount', () => {
  it('should format numbers less than 1000 as plain numbers', () => {
    expect(formatHeadcount(0)).toBe('0');
    expect(formatHeadcount(1)).toBe('1');
    expect(formatHeadcount(999)).toBe('999');
  });

  it('should format thousands with K suffix', () => {
    expect(formatHeadcount(1000)).toBe('1.0K');
    expect(formatHeadcount(1500)).toBe('1.5K');
    expect(formatHeadcount(10000)).toBe('10.0K');
    expect(formatHeadcount(999999)).toBe('1000.0K');
  });

  it('should format millions with M suffix', () => {
    expect(formatHeadcount(1000000)).toBe('1.0M');
    expect(formatHeadcount(2500000)).toBe('2.5M');
    expect(formatHeadcount(10000000)).toBe('10.0M');
  });

  it('should handle edge cases', () => {
    expect(formatHeadcount(0)).toBe('0');
  });
}); 