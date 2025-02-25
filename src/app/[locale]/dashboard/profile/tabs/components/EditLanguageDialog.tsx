import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { LANGUAGES } from "@/constants/languages";
import { useAuth } from "@/hooks/useAuth";

const EditLanguageDialog = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (o: boolean) => void;
}) => {
  const router = useRouter();
  const currentLocale = useLocale();
  const [selectedLanguage, setSelectedLanguage] = useState(currentLocale);
  const { updateUserLanguage } = useAuth({ enableFetch: false });

  const handleSave = () => {
    updateUserLanguage({ language: selectedLanguage });
    router.push(`/${selectedLanguage}/dashboard/profile`);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Languages</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          {LANGUAGES.map(({ code, label }) => (
            <div
              key={code}
              className={`p-2 cursor-pointer rounded-lg ${
                selectedLanguage === code
                  ? "bg-gray-200 font-bold"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setSelectedLanguage(code)}
            >
              {label}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditLanguageDialog;
