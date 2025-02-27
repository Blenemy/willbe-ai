"use client";

import { useState } from "react";
import ProfileCard from "./components/ProfileCard";
import EditPasswordDialog from "./components/EditPasswordDialog";

const SecurityTab = () => {
  const [editPassword, setEditPassword] = useState(false);

  return (
    <div className="px-6 flex flex-col gap-5">
      <h2 className="font-bold text-xl">Security</h2>

      <ProfileCard
        title="Update your password"
        onEdit={() => setEditPassword(true)}
      >
        <div className="grid grid-cols-2 w-full gap-y-3"></div>
      </ProfileCard>

      <EditPasswordDialog open={editPassword} setOpen={setEditPassword} />
    </div>
  );
};

export default SecurityTab;
