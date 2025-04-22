"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface EditMessageModalProps {
  open: boolean;
  onClose: () => void;
  initialMessage: string;
  onSave: (newMessage: string) => void;
  leadName?: string;
}

export const EditMessageModal = ({
  open,
  onClose,
  initialMessage,
  onSave,
  leadName,
}: EditMessageModalProps) => {
  const [message, setMessage] = useState(initialMessage);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Edit message {leadName ? `for ${leadName}` : ""}
          </DialogTitle>
        </DialogHeader>

        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-96"
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSave(message);
              onClose();
            }}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
