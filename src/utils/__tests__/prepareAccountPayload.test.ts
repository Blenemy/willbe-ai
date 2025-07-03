import { prepareAccountPayload } from "../prepareAccountPayload";

interface FilterValue {
  filterKey: string;
  filterValue: string | number | boolean | { from: number; to: number };
}

describe("prepareAccountPayload", () => {
  it("should create basic payload with account name", () => {
    const result = prepareAccountPayload({}, "Test Account");
    
    expect(result).toEqual({
      name: "Test Account",
      filterValues: []
    });
  });

  it("should handle simple fields correctly", () => {
    const values = {
      network_distance: "1st",
      keywords: "test keywords",
      has_job_offers: true,
      annual_revenue_currency: "USD",
      recent_activities: "posted"
    };

    const result = prepareAccountPayload(values, "Test Account");

    expect(result.filterValues).toHaveLength(5);
    expect(result.filterValues).toContainEqual({
      filterKey: "network_distance",
      filterValue: "1st"
    });
    expect(result.filterValues).toContainEqual({
      filterKey: "keywords", 
      filterValue: "test keywords"
    });
    expect(result.filterValues).toContainEqual({
      filterKey: "has_job_offers",
      filterValue: true
    });
    expect(result.filterValues).toContainEqual({
      filterKey: "annual_revenue_currency",
      filterValue: "USD"
    });
    expect(result.filterValues).toContainEqual({
      filterKey: "recent_activities",
      filterValue: "posted"
    });
  });

  it("should skip empty string values for simple fields", () => {
    const values = {
      network_distance: "",
      keywords: "test",
      has_job_offers: false, // This will be filtered out because it's falsy
      annual_revenue_currency: "",
      recent_activities: ""
    };

    const result = prepareAccountPayload(values, "Test Account");

    expect(result.filterValues).toHaveLength(1);
    expect(result.filterValues).toContainEqual({
      filterKey: "keywords",
      filterValue: "test"
    });
  });

  it("should include truthy boolean values", () => {
    const values = {
      has_job_offers: true,
      keywords: "test"
    };

    const result = prepareAccountPayload(values, "Test Account");

    expect(result.filterValues).toHaveLength(2);
    expect(result.filterValues).toContainEqual({
      filterKey: "has_job_offers",
      filterValue: true
    });
    expect(result.filterValues).toContainEqual({
      filterKey: "keywords",
      filterValue: "test"
    });
  });

  it("should handle headcount range correctly", () => {
    const values = {
      headcount_from: 100,
      headcount_to: 500
    };

    const result = prepareAccountPayload(values, "Test Account");

    expect(result.filterValues).toHaveLength(1);
    expect(result.filterValues[0]).toEqual({
      filterKey: "headcount",
      filterValue: { from: 100, to: 500 }
    });
  });

  it("should handle headcount range with only from value", () => {
    const values = {
      headcount_from: 100
    };

    const result = prepareAccountPayload(values, "Test Account");

    expect(result.filterValues).toHaveLength(1);
    expect(result.filterValues[0]).toEqual({
      filterKey: "headcount",
      filterValue: { from: 100, to: 0 }
    });
  });

  it("should handle headcount range with only to value", () => {
    const values = {
      headcount_to: 500
    };

    const result = prepareAccountPayload(values, "Test Account");

    expect(result.filterValues).toHaveLength(1);
    expect(result.filterValues[0]).toEqual({
      filterKey: "headcount",
      filterValue: { from: 0, to: 500 }
    });
  });

  it("should convert string values to numbers for ranges", () => {
    const values = {
      headcount_from: "100",
      headcount_to: "500",
      fortune_from: "1000",
      fortune_to: "5000"
    };

    const result = prepareAccountPayload(values, "Test Account");

    expect(result.filterValues).toHaveLength(2);
    expect(result.filterValues).toContainEqual({
      filterKey: "headcount",
      filterValue: { from: 100, to: 500 }
    });
    expect(result.filterValues).toContainEqual({
      filterKey: "fortune",
      filterValue: { from: 1000, to: 5000 }
    });
  });

  it("should handle all range fields", () => {
    const values = {
      headcount_from: 100,
      headcount_to: 500,
      headcount_growth_from: 10,
      headcount_growth_to: 50,
      fortune_from: 1000,
      fortune_to: 5000,
      followers_count_from: 1000,
      followers_count_to: 10000,
      department_headcount_growth_from: 5,
      department_headcount_growth_to: 25,
      department_headcount_from: 50,
      department_headcount_to: 200,
      annual_revenue_from: "1000000",
      annual_revenue_to: "5000000"
    };

    const result = prepareAccountPayload(values, "Test Account");

    expect(result.filterValues).toHaveLength(7);
    
    const rangeKeys = [
      "headcount",
      "headcount_growth", 
      "fortune",
      "followers_count",
      "department_headcount_growth",
      "department_headcount",
      "annual_revenue"
    ];

    rangeKeys.forEach(key => {
      expect(result.filterValues.some((filter: FilterValue) => filter.filterKey === key)).toBe(true);
    });
  });

  it("should handle complex payload with both simple and range fields", () => {
    const values = {
      network_distance: "1st",
      keywords: "technology startup",
      has_job_offers: true,
      headcount_from: 100,
      headcount_to: 500,
      annual_revenue_currency: "USD",
      recent_activities: "posted"
    };

    const result = prepareAccountPayload(values, "Complex Account");

    expect(result.name).toBe("Complex Account");
    expect(result.filterValues).toHaveLength(6);
    
    // Check for simple fields
    expect(result.filterValues).toContainEqual({
      filterKey: "network_distance",
      filterValue: "1st"
    });
    expect(result.filterValues).toContainEqual({
      filterKey: "keywords",
      filterValue: "technology startup"
    });
    expect(result.filterValues).toContainEqual({
      filterKey: "has_job_offers",
      filterValue: true
    });
    expect(result.filterValues).toContainEqual({
      filterKey: "annual_revenue_currency",
      filterValue: "USD"
    });
    expect(result.filterValues).toContainEqual({
      filterKey: "recent_activities",
      filterValue: "posted"
    });
    
    // Check for range field
    expect(result.filterValues).toContainEqual({
      filterKey: "headcount",
      filterValue: { from: 100, to: 500 }
    });
  });

  it("should handle 0 values correctly", () => {
    const values = {
      headcount_from: 0,
      headcount_to: 0,
      followers_count_from: 0
    };

    const result = prepareAccountPayload(values, "Test Account");

    expect(result.filterValues).toHaveLength(2);
    expect(result.filterValues).toContainEqual({
      filterKey: "headcount",
      filterValue: { from: 0, to: 0 }
    });
    expect(result.filterValues).toContainEqual({
      filterKey: "followers_count", 
      filterValue: { from: 0, to: 0 }
    });
  });

  it("should handle undefined values correctly", () => {
    const values = {
      headcount_from: undefined,
      headcount_to: undefined,
      keywords: undefined,
      network_distance: ""
    };

    const result = prepareAccountPayload(values, "Test Account");

    expect(result.filterValues).toHaveLength(0);
  });
}); 