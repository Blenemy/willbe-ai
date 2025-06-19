import { UserRoles } from "@/types/Roles";

export function hasPermission(
  required: UserRoles[] | UserRoles,
  current?: string
): boolean {
  if (!current) return false;

  const requiredRoles = Array.isArray(required) ? required : [required];
  return requiredRoles.includes(current as UserRoles);
}
