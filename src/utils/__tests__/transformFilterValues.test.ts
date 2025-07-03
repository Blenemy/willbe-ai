import { transformFilterValues } from "../transformFilterValues";

describe("transformFilterValues", () => {
  it("should transform primitive values", () => {
    const input = [
      { filterKey: "industry", filterValue: "Software" },
      { filterKey: "has_job_offers", filterValue: true },
      { filterKey: "headcount", filterValue: 100 },
    ];

    const result = transformFilterValues(input);
    expect(result).toEqual({
      industry: "Software",
      has_job_offers: true,
      headcount: "100",
    });
  });

  it("should transform array values", () => {
    const input = [
      { filterKey: "technologies", filterValue: ["React", "Node.js"] },
    ];

    const result = transformFilterValues(input);
    expect(result).toEqual({
      technologies: ["React", "Node.js"],
    });
  });

  it("should transform include/exclude object", () => {
    const input = [
      {
        filterKey: "industry",
        filterValue: {
          include: ["Tech", "Finance"],
          exclude: ["Retail"],
        },
      },
    ];

    const result = transformFilterValues(input);
    expect(result).toEqual({
      industry_include: ["Tech", "Finance"],
      industry_exclude: ["Retail"],
    });
  });

  it("should transform from/to object", () => {
    const input = [
      {
        filterKey: "headcount_growth",
        filterValue: {
          from: 10,
          to: 50,
        },
      },
    ];

    const result = transformFilterValues(input);
    expect(result).toEqual({
      headcount_growth_from: "10",
      headcount_growth_to: "50",
    });
  });

  it("should fallback to empty string when from/to are null/undefined", () => {
    const input = [
      {
        filterKey: "followers_count",
        filterValue: {
          from: null,
          to: undefined,
        },
      },
    ];

    const result = transformFilterValues(input);
    expect(result).toEqual({
      followers_count_from: "",
      followers_count_to: "",
    });
  });

  it("should ignore unknown object shape", () => {
    const input = [
      {
        filterKey: "custom",
        filterValue: { foo: "bar" },
      },
    ];

    const result = transformFilterValues(input);
    expect(result).toEqual({});
  });
});
