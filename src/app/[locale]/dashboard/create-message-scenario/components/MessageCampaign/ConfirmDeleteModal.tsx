"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface ConfirmDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  leadName?: string;
}

export const ConfirmDeleteModal = ({
  open,
  onClose,
  onConfirm,
  leadName,
}: ConfirmDeleteModalProps) => {
  const t = useTranslations("messageScenarioData");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("modals.deleteTitle")}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          {t("modals.deleteConfirm", { name: leadName ?? "" })}
        </p>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            {t("buttons.cancel")}
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            {t("buttons.delete")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
