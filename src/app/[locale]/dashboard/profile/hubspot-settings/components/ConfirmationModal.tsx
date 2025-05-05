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
import { Progress } from "@/components/ui/progress";

type Props = {
  open: boolean;
  onClose: () => void;
  companyId: string;
  onSuccess?: () => void;
};

export const ConfirmationModal = ({ open, onClose, companyId }: Props) => {
  const { mutateAsync: startIntegration, isPending } =
    useStartHubspotIntegration();

  const handleStart = async (enrich: boolean) => {
    if (!companyId) return;

    try {
      await startIntegration({ companyId, enrich });
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        {isPending ? (
          <>
            <DialogHeader>
              <DialogTitle className="font-semibold mb-2">
                Syncing HubSpot Data
              </DialogTitle>
              <DialogDescription>
                We’re enriching your data and syncing it with HubSpot. This
                might take some time.
              </DialogDescription>
            </DialogHeader>
            <Progress
              value={100}
              className="animate-pulse h-4 my-4 [&>div]:bg-[#084960]"
            />
            <Button variant="outline" className="w-full" onClick={onClose}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-semibold mb-2">
                Are you sure?
              </DialogTitle>
              <DialogDescription>
                Clicking continue and enrich, some of the information that you
                have for these accounts in HubSpot may be overwritten, with the
                freshest information about these accounts.
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
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
