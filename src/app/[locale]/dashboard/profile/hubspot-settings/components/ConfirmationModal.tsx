"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useStartHubspotIntegration } from "@/hooks/useConnectHubspot";

type Props = {
  open: boolean;
  onClose: () => void;
  companyId: string;
  onSuccess?: () => void;
};

export const ConfirmationModal = ({ open, onClose, companyId }: Props) => {
  const { mutateAsync: startIntegration } = useStartHubspotIntegration();

  const handleStart = async (enrich: boolean) => {
    if (!companyId) return;

    await startIntegration({ companyId: companyId, enrich });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-semibold mb-2">
            Are you sure?
          </DialogTitle>
          <DialogDescription>
            Clicking continue and enrich, some of the information that you have
            for these accounts in HubSpot may be overwritten, with the freshest
            information about these accounts.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Button
            className="w-full bg-[#084960] text-white"
            onClick={() => handleStart(true)}
          >
            Continue and Enrich
          </Button>
          <Button
            className="w-full bg-[#084960] text-white"
            onClick={() => handleStart(false)}
          >
            Continue Without Enriching
          </Button>
          <Button variant="outline" className="w-full" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
