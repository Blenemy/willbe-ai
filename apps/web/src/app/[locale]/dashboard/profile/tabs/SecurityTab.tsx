"use client";

import { useState } from "react";
import ProfileCard from "./components/ProfileCard";
import EditPasswordDialog from "./components/EditPasswordDialog";
import { useTranslations } from "next-intl";

const SecurityTab = () => {
  const t = useTranslations("Profile");
  const [editPassword, setEditPassword] = useState(false);

  return (
    <div className="px-6 flex flex-col gap-5">
      <h2 className="font-bold text-xl">{t("tab_security")}</h2>

      <ProfileCard
        title={t("change_password")}
        onEdit={() => setEditPassword(true)}
      >
        <div className="grid grid-cols-2 w-full gap-y-3"></div>
      </ProfileCard>

      <EditPasswordDialog open={editPassword} setOpen={setEditPassword} />
    </div>
  );
};

export default SecurityTab;
