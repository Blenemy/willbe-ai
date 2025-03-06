"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableCaption,
  TableHeader,
} from "@/components/ui/table";

const UsersPage = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      role: "Admin",
      position: "Manager",
      email: "john@example.com",
    },
    {
      id: 2,
      name: "Jane Smith",
      role: "Member",
      position: "Developer",
      email: "jane@example.com",
    },
  ]);

  const [openInvite, setOpenInvite] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openRemove, setOpenRemove] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("member");

  const inviteUser = () => {
    setUsers([
      ...users,
      {
        id: users.length + 1,
        name: "New User",
        role: newRole,
        position: "",
        email: newEmail,
      },
    ]);
    setOpenInvite(false);
  };

  const editUser = () => {
    setUsers(
      users.map((user) =>
        user.id === selectedUser.id ? { ...user, role: newRole } : user
      )
    );
    setOpenEdit(false);
  };

  const removeUser = () => {
    setUsers(users.filter((user) => user.id !== selectedUser.id));
    setOpenRemove(false);
  };

  return (
    <div className="bg-gray-100 w-full px-6 py-10 flex flex-col">
      <h2 className="mb-5 font-semibold text-2xl">Users Settings</h2>
      <div className="flex justify-end">
        <Button onClick={() => setOpenInvite(true)}>Add New User</Button>
      </div>
      <Table className="mt-5">
        <TableCaption>A list of your application users</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">User name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.position}</TableCell>
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

      <Dialog open={openInvite} onOpenChange={setOpenInvite}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite User</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="User Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <Select value={newRole} onValueChange={setNewRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="member">Member</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={inviteUser}>Invite</Button>
        </DialogContent>
      </Dialog>

      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <Select value={newRole} onValueChange={setNewRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="member">Member</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={editUser}>Save Changes</Button>
        </DialogContent>
      </Dialog>

      <Dialog open={openRemove} onOpenChange={setOpenRemove}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to remove the user?</DialogTitle>
          </DialogHeader>
          <Button onClick={removeUser} variant="destructive">
            Yes
          </Button>
          <Button onClick={() => setOpenRemove(false)}>No</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersPage;
