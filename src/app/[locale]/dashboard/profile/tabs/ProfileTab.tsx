"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import ProfileCard from "./components/ProfileCard";
import EditPersonalInfoDialog from "./components/EditPersonalInfoDialog";
import EditLanguageDialog from "./components/EditLanguageDialog";

const ProfileTab = () => {
  const [editPersonalOpen, setEditPersonalOpen] = useState(false);
  const [editLanguageOpen, setEditLanguageOpen] = useState(false);

  return (
    <div className="px-6 flex flex-col gap-5">
      <h2 className="font-bold text-xl">My profile</h2>

      <ProfileCard>
        <div className="flex gap-4 items-center">
          <Avatar className="w-16 h-16">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <p className="font-bold">User name</p>
            <p className="text-gray-500">User role</p>
            <p className="text-gray-500">User location</p>
          </div>
        </div>
      </ProfileCard>

      <ProfileCard
        title="Personal Information"
        onEdit={() => setEditPersonalOpen(true)}
      >
        <div className="grid grid-cols-2 w-full gap-y-3">
          <div className="flex flex-col gap-2">
            <p className="text-gray-400 font-semibold">First Name</p>
            <p className="font-semibold">Rafiqur</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-gray-400 font-semibold">Last Name</p>
            <p className="font-semibold">Rahman</p>
          </div>
        </div>
      </ProfileCard>

      <ProfileCard title="Language" onEdit={() => setEditLanguageOpen(true)}>
        <p className="font-semibold">English</p>
      </ProfileCard>

      <EditPersonalInfoDialog
        open={editPersonalOpen}
        setOpen={setEditPersonalOpen}
      />
      <EditLanguageDialog
        open={editLanguageOpen}
        setOpen={setEditLanguageOpen}
      />
    </div>
  );
};

export default ProfileTab;
