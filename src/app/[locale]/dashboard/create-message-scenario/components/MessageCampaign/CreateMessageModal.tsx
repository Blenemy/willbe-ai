"use client";

import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  MessageType,
  useMessageChainStore,
} from "@/store/useMessageChainStore";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (type: string, sendDate: string) => void;
  onEdit: (id: string, type: string, sendDate: string) => void;
  mode?: "create" | "edit";
  initialData?: { id: string; type: string; sendDate: string };
}

const formSchema = z.object({
  type: z.string().min(1, "messageChain.validation.typeRequired"),
  date: z.string().min(1, "messageChain.validation.dateRequired"),
  time: z.string().min(1, "messageChain.validation.timeRequired"),
});

type FormValues = z.infer<typeof formSchema>;

export const CreateMessageModal = ({
  open,
  onClose,
  onAdd,
  onEdit,
  mode = "create",
  initialData,
}: Props) => {
  const t = useTranslations("messageChain");
  const store = useMessageChainStore();

  const availableTypes = useMemo(() => {
    return store.getAvailableMessageTypes(initialData?.id ?? "");
  }, [store, initialData?.id]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: initialData?.type || "",
      date: initialData?.sendDate
        ? new Date(initialData.sendDate).toISOString().slice(0, 10)
        : "",
      time: initialData?.sendDate
        ? new Date(initialData.sendDate).toTimeString().slice(0, 5)
        : "",
    },
  });

  const onSubmit = (values: FormValues) => {
    const { type, date, time } = values;
    const iso = new Date(`${date}T${time}`).toISOString();
    const now = new Date().toISOString();

    if (iso < now) {
      toast.error(t("validation.dateInPast"));
      return;
    }

    const { valid, reason } = store.canCreateEntry(
      type as MessageType,
      initialData?.id
    );

    if (!valid) {
      toast.error(reason);
      return;
    }

    if (mode === "edit" && initialData?.id) {
      onEdit(initialData.id, type, iso);
    } else {
      onAdd(type, iso);
    }

    onClose();
  };

  useEffect(() => {
    if (!open) {
      form.reset({
        type: initialData?.type || "",
        date: initialData?.sendDate
          ? new Date(initialData.sendDate).toISOString().slice(0, 10)
          : "",
        time: initialData?.sendDate
          ? new Date(initialData.sendDate).toTimeString().slice(0, 5)
          : "",
      });
    }
  }, [open, form, initialData]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="min-w-[451px] p-6">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? t("modal.editTitle") : t("modal.addTitle")}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("modal.typeLabel")}</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder={t("modal.typePlaceholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTypes.map((value) => (
                          <SelectItem key={value} value={value}>
                            {value
                              .replace(/_/g, " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 w-full">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>{t("modal.dateLabel")}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>{t("modal.timeLabel")}</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                {t("modal.cancel")}
              </Button>
              <Button type="submit">
                {mode === "edit" ? t("modal.save") : t("modal.add")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
