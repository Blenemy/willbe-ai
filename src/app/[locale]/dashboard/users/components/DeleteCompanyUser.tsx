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
  const { deleteCompanyUser } = useCompanyUsers({
    enableFetch: false,
  });
  const handleRemoveClick = () => {
    deleteCompanyUser(user.id);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to remove the user {user.firstName}{" "}
            {user.lastName}?
          </DialogTitle>
        </DialogHeader>
        <Button onClick={handleRemoveClick} variant="destructive">
          Yes
        </Button>
        <Button onClick={() => setOpen(false)}>No</Button>
      </DialogContent>
    </Dialog>
  );
};
