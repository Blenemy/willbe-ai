"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableCaption,
  TableHeader,
} from "@/components/ui/table";
import { useCompanyUsers } from "@/hooks/useCompanyUsers";
import { EditCompanyUser } from "./components/EditCompanyUsers";
import { DeleteCompanyUser } from "./components/DeleteCompanyUser";
import TableSkeleton from "./skeletons/TableSkeleton";
import { User } from "@/types/User";

const userRoleMap = {
  super_admin: "Super admin",
  member: "Member",
  admin: "Admin",
} as const;

const UsersPage = () => {
  const t = useTranslations("Users");

  const [openEdit, setOpenEdit] = useState(false);
  const [openRemove, setOpenRemove] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { companyUsers, isLoading } = useCompanyUsers({ enableFetch: true });

  return (
    <div className="w-full px-6 py-10 flex flex-col">
      <h2 className="mb-5 font-semibold text-2xl">{t("title")}</h2>

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <Table className="mt-5">
          <TableCaption>{t("table_caption")}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>{t("table_username")}</TableHead>
              <TableHead>{t("table_role")}</TableHead>
              <TableHead>{t("table_position")}</TableHead>
              <TableHead>{t("table_email")}</TableHead>
              <TableHead className="text-right">{t("table_actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companyUsers?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  {user.firstName} {user.lastName}
                </TableCell>
                <TableCell>
                  {userRoleMap[user.role as keyof typeof userRoleMap]}
                </TableCell>
                <TableCell>{user.position || "N/A"}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="flex justify-end gap-3">
                  <Button
                    onClick={() => {
                      setSelectedUser(user);
                      setOpenEdit(true);
                    }}
                  >
                    {t("edit")}
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedUser(user);
                      setOpenRemove(true);
                    }}
                    variant="destructive"
                  >
                    {t("remove")}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {selectedUser && (
        <DeleteCompanyUser
          open={openRemove}
          setOpen={setOpenRemove}
          user={selectedUser}
        />
      )}

      {selectedUser && (
        <EditCompanyUser
          open={openEdit}
          setOpen={setOpenEdit}
          user={selectedUser}
        />
      )}
    </div>
  );
};

export default UsersPage;
