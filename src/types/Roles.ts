export enum UserRoles {
  super_admin = "super_admin",
  admin = "admin",
  member = "member",
}

export const SUPER_ADMIN_ONLY = [UserRoles.super_admin];
export const ADMINS_ONLY = [UserRoles.super_admin, UserRoles.admin];
export const MEMBER_ONLY = [UserRoles.member];
export const ALL_ROLES = [
  UserRoles.super_admin,
  UserRoles.admin,
  UserRoles.member,
];
