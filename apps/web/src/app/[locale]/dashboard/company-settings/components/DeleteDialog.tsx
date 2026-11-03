"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCompany } from "@/hooks/useCompany";
import { ProductsAndServices } from "@/types/Company";
import { useTranslations } from "next-intl";

const DeleteDialog = ({
  open,
  setOpen,
  productToDelete,
}: {
  open: boolean;
  setOpen: (o: boolean) => void;
  productToDelete: ProductsAndServices | null;
}) => {
  const t = useTranslations("Company");

  const { deleteCompanyProductAndService } = useCompany({ enableFetch: false });

  const onSubmit = () => {
    if (productToDelete !== null) {
      deleteCompanyProductAndService({ id: productToDelete.id });
    }
    setOpen(false);
  };

  if (!productToDelete) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("product_delete_confirm", { name: productToDelete.name })}
          </DialogTitle>
        </DialogHeader>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t("go_back")}
          </Button>
          <Button variant="destructive" onClick={onSubmit}>
            {t("delete")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;
