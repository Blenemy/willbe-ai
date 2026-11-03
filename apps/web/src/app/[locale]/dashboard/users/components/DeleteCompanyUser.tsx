"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCompanyUsers } from "@/hooks/useCompanyUsers";
import { User } from "@/types/User";
import { Dispatch, SetStateAction } from "react";
import { useTranslations } from "next-intl";

interface DeleteCompanyUserProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  user: User;
}

export const DeleteCompanyUser = ({
  open,
  setOpen,
  user,
}: DeleteCompanyUserProps) => {
  const t = useTranslations("Users");
  const { deleteCompanyUser } = useCompanyUsers({
    enableFetch: false,
  });

  const handleRemoveClick = () => {
    deleteCompanyUser(user.id);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("delete_confirm", {
              user: `${user.firstName} ${user.lastName}`,
            })}
          </DialogTitle>
        </DialogHeader>
        <Button onClick={handleRemoveClick} variant="destructive">
          {t("yes")}
        </Button>
        <Button onClick={() => setOpen(false)}>{t("no")}</Button>
      </DialogContent>
    </Dialog>
  );
};
