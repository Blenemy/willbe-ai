import { UserRoles } from "@/types/Roles";
import { hasPermission } from "@/utils/hasPermission/hasPermission";

describe("hasPermission", () => {
  it("returns true if current role is in required roles array", () => {
    expect(
      hasPermission([UserRoles.admin, UserRoles.member], UserRoles.member)
    ).toBe(true);
  });

  it("returns false if current role is not in required roles array", () => {
    expect(hasPermission([UserRoles.admin], UserRoles.member)).toBe(false);
  });

  it("returns true if current role matches required role (not array)", () => {
    expect(hasPermission(UserRoles.super_admin, UserRoles.super_admin)).toBe(
      true
    );
  });

  it("returns false if current role does not match required role (not array)", () => {
    expect(hasPermission(UserRoles.admin, UserRoles.super_admin)).toBe(false);
  });

  it("returns false if current role is undefined", () => {
    expect(hasPermission([UserRoles.admin])).toBe(false);
  });

  it("returns false if required is empty array", () => {
    expect(hasPermission([], UserRoles.member)).toBe(false);
  });

  it("returns false if required is not matching and current is string but not enum", () => {
    expect(hasPermission(UserRoles.super_admin, "random_string")).toBe(false);
  });
});
