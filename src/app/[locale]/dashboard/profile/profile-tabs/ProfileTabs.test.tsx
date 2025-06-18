import { render, screen } from "@testing-library/react";
import { UserRoles } from "@/types/Roles";
import * as useAuthStoreModule from "@/store/useAuthStore";
import ProfileTabs from "./ProfileTabs";

jest.mock("../tabs/ProfileTab", () => {
  const Mock = () => <div />;
  Mock.displayName = "MockProfileTab";
  return Mock;
});
jest.mock("../tabs/SecurityTab", () => {
  const Mock = () => <div />;
  Mock.displayName = "MockSecurityTab";
  return Mock;
});
jest.mock("../tabs/ConnectionsTab", () => {
  const Mock = () => <div />;
  Mock.displayName = "MockConnectionsTab";
  return Mock;
});
jest.mock("../tabs/SignatureTab", () => {
  const Mock = () => <div />;
  Mock.displayName = "MockSignatureTab";
  return Mock;
});
jest.mock("../tabs/BillingTab", () => {
  const Mock = () => <div />;
  Mock.displayName = "MockBillingTab";
  return Mock;
});

const baseTranslations = {
  tab_profile: "Profile",
  tab_security: "Security",
  tab_connections: "Connections",
  tab_signature: "Signature",
  tab_billing: "Billing",
  account_settings: "Settings",
};

describe("ProfileTabs role-based rendering", () => {
  const mockUserRole = (role?: UserRoles) => {
    jest.spyOn(useAuthStoreModule, "useAuthStore").mockReturnValue({
      user: { role },
      setUser: jest.fn(),
      logout: jest.fn(),
      hasPermission: jest.fn(),
    });
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders all tabs for super_admin", () => {
    mockUserRole(UserRoles.super_admin);

    render(<ProfileTabs translations={baseTranslations} />);

    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Security")).toBeInTheDocument();
    expect(screen.getByText("Connections")).toBeInTheDocument();
    expect(screen.getByText("Signature")).toBeInTheDocument();
  });

  it("renders nothing if role is undefined", () => {
    render(<ProfileTabs translations={baseTranslations} />);

    expect(screen.queryByText("Profile")).not.toBeInTheDocument();
    expect(screen.queryByText("Signature")).not.toBeInTheDocument();
  });
});
