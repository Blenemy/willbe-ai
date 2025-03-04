import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCompany } from "@/hooks/useCompany";
import { ProductsAndServices } from "@/types/Company";

const DeleteDialog = ({
  open,
  setOpen,
  productToDelete,
}: {
  open: boolean;
  setOpen: (o: boolean) => void;
  productToDelete: ProductsAndServices | null;
}) => {
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
            {`Are you sure you want to delete ${productToDelete.name}?`}
          </DialogTitle>
        </DialogHeader>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Go back
          </Button>
          <Button variant="destructive" onClick={onSubmit}>
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;
