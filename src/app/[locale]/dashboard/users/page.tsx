"use client";

import { useState } from "react";
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
import { User } from "@/types/User";
import { DeleteCompanyUser } from "./components/DeleteCompanyUser";
import { CreateCompanyUsers } from "./components/CreateCompanyUsers";
import TableSkeleton from "./skeletons/TableSkeleton";

const UsersPage = () => {
  const [openInvite, setOpenInvite] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openRemove, setOpenRemove] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { companyUsers, isLoading } = useCompanyUsers({ enableFetch: true });

  return (
    <div className="w-full px-6 py-10 flex flex-col">
      <h2 className="mb-5 font-semibold text-2xl">Users Settings</h2>
      <div className="flex justify-end">
        <Button onClick={() => setOpenInvite(true)}>Add New User</Button>
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <Table className="mt-5">
          <TableCaption>A list of your company users</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>User name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companyUsers?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  {user.firstName} {user.lastName}
                </TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.position || "N/A"}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="flex justify-end gap-3">
                  <Button
                    onClick={() => {
                      setSelectedUser(user);
                      setOpenEdit(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedUser(user);
                      setOpenRemove(true);
                    }}
                    variant="destructive"
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <CreateCompanyUsers open={openInvite} setOpen={setOpenInvite} />

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
