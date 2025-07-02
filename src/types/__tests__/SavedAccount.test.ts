import { SavedAccount } from "../SavedAccount";

describe("SavedAccount Type", () => {
  it("should accept valid SavedAccount object with number headcount", () => {
    const validSavedAccount: SavedAccount = {
      id: "saved-123",
      accountScenarioId: "scenario-456",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      accountData: {
        id: "account-789",
        name: "Saved Tech Company", 
        summary: "A technology company we saved",
        industry: "Software Development",
        headcount: 250,
        location: "Austin, TX",
        profile_url: "https://linkedin.com/company/saved-tech",
        logo: "https://example.com/saved-logo.png"
      }
    };

    expect(validSavedAccount.accountData.headcount).toBe(250);
    expect(typeof validSavedAccount.accountData.headcount).toBe("number");
  });

  it("should accept SavedAccount with zero headcount", () => {
    const savedAccount: SavedAccount = {
      id: "saved-startup",
      accountScenarioId: "scenario-startup",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      accountData: {
        id: "startup-account",
        name: "Early Stage Startup",
        summary: "Very early stage company",
        industry: "AI/ML",
        headcount: 0,
        location: "Palo Alto, CA",
        profile_url: "https://linkedin.com/company/early-startup",
        logo: "https://example.com/startup.png"
      }
    };

    expect(savedAccount.accountData.headcount).toBe(0);
  });

  it("should accept SavedAccount with large enterprise headcount", () => {
    const enterpriseAccount: SavedAccount = {
      id: "saved-enterprise",
      accountScenarioId: "scenario-enterprise",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      accountData: {
        id: "enterprise-account",
        name: "Global Enterprise",
        summary: "Fortune 500 company",
        industry: "Financial Services",
        headcount: 100000,
        location: "New York, NY",
        profile_url: "https://linkedin.com/company/global-enterprise",
        logo: "https://example.com/enterprise.png"
      }
    };

    expect(enterpriseAccount.accountData.headcount).toBe(100000);
    expect(typeof enterpriseAccount.accountData.headcount).toBe("number");
  });

  it("should handle SavedAccount comparison for headcount changes", () => {
    const beforeGrowth: SavedAccount = {
      id: "growth-company",
      accountScenarioId: "scenario-growth",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      accountData: {
        id: "growth-account",
        name: "Growing Company",
        summary: "Company experiencing growth",
        industry: "E-commerce",
        headcount: 50,
        location: "Seattle, WA",
        profile_url: "https://linkedin.com/company/growing",
        logo: "https://example.com/growing.png"
      }
    };

    const afterGrowth: SavedAccount = {
      ...beforeGrowth,
      updatedAt: "2024-06-01T00:00:00Z",
      accountData: {
        ...beforeGrowth.accountData,
        headcount: 75
      }
    };

    expect(afterGrowth.accountData.headcount - beforeGrowth.accountData.headcount).toBe(25);
    expect(afterGrowth.accountData.headcount > beforeGrowth.accountData.headcount).toBe(true);
  });

  it("should maintain type consistency with nested accountData", () => {
    const savedAccount: SavedAccount = {
      id: "consistent-123",
      accountScenarioId: "scenario-consistent",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      accountData: {
        id: "consistent-account",
        name: "Consistent Company",
        summary: "Ensuring type consistency",
        industry: "Technology",
        headcount: 500,
        location: "San Francisco, CA",
        profile_url: "https://linkedin.com/company/consistent",
        logo: "https://example.com/consistent.png"
      }
    };

    // Verify headcount is a number type (not string)
    expect(typeof savedAccount.accountData.headcount).toBe("number");
    expect(savedAccount.accountData.headcount).toBeGreaterThanOrEqual(0);
  });
}); 