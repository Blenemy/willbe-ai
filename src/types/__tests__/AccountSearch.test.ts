import { AccountSearch } from "../AccountSearch";

describe("AccountSearch Type", () => {
  it("should accept valid AccountSearch object with number headcount", () => {
    const validAccountSearch: AccountSearch = {
      id: "test-id",
      name: "Test Company",
      profile_url: "https://linkedin.com/company/test",
      summary: "Test company summary",
      industry: "Technology",
      location: "San Francisco, CA",
      headcount: 100,
      logo: "https://example.com/logo.png",
      type: "company"
    };

    expect(validAccountSearch.headcount).toBe(100);
    expect(typeof validAccountSearch.headcount).toBe("number");
  });

  it("should accept AccountSearch with zero headcount", () => {
    const accountSearch: AccountSearch = {
      id: "test-id",
      name: "Startup Company",
      profile_url: "https://linkedin.com/company/startup",
      summary: "New startup",
      industry: "Software",
      location: "New York, NY", 
      headcount: 0,
      logo: "https://example.com/startup-logo.png",
      type: "startup"
    };

    expect(accountSearch.headcount).toBe(0);
  });

  it("should accept AccountSearch with large headcount", () => {
    const accountSearch: AccountSearch = {
      id: "enterprise-id",
      name: "Enterprise Corp",
      profile_url: "https://linkedin.com/company/enterprise",
      summary: "Large enterprise company",
      industry: "Manufacturing",
      location: "Chicago, IL",
      headcount: 50000,
      logo: "https://example.com/enterprise-logo.png",
      type: "enterprise"
    };

    expect(accountSearch.headcount).toBe(50000);
  });

  it("should handle AccountSearch with optional fields", () => {
    const minimalAccountSearch: AccountSearch = {
      id: "minimal-id",
      name: "Minimal Company",
      profile_url: "https://linkedin.com/company/minimal",
      summary: "",
      industry: "",
      location: "",
      headcount: 10,
      logo: "",
      type: "company"
    };

    expect(minimalAccountSearch.headcount).toBe(10);
    expect(typeof minimalAccountSearch.headcount).toBe("number");
  });
}); 