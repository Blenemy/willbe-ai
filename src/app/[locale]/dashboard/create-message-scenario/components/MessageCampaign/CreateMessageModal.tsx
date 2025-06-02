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
  onAdd: (type: string, sendDate: string, sendNow: boolean) => void;
  onEdit: (
    id: string,
    type: string,
    sendDate: string,
    sendNow: boolean
  ) => void;
  mode?: "create" | "edit";
  initialData?: { id: string; type: string; sendDate: string };
}

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

  const formSchema = z
    .object({
      type: z.string().min(1, t("validation.typeRequired")),
      date: z.string().optional(),
      time: z.string().optional(),
      sendNow: z.boolean().optional(),
    })
    .refine(
      (data) => {
        if (data.sendNow) return true;
        return !!data.date && !!data.time;
      },
      {
        message: t("validation.dateRequired"),
        path: ["date"],
      }
    );

  type FormValues = z.infer<typeof formSchema>;

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

  const type = form.watch("type");
  const allowSendNow = store.shouldAllowSendNowCheckbox(type as MessageType);

  const onSubmit = (values: FormValues) => {
    const { type, date, time, sendNow } = values;

    const isSendNow = !!sendNow;

    let combined: string | null = null;

    if (!isSendNow) {
      if (!date || !time) {
        toast.error(t("validation.dateInPast"));
        return;
      }

      combined = `${date}T${time}:00`;
      const now = new Date();
      const selected = new Date(combined);

      if (selected < now) {
        toast.error(t("validation.dateInPast"));
        return;
      }
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
      onEdit(initialData.id, type, combined ?? "", isSendNow);
    } else {
      onAdd(type, combined ?? "", isSendNow);
    }

    onClose();
  };

  useEffect(() => {
    if (open) {
      if (initialData) {
        if (initialData.sendDate) {
          const d = new Date(initialData.sendDate);

          form.reset({
            type: initialData.type || "",
            date: d.toISOString().slice(0, 10),
            time: `${d.getUTCHours().toString().padStart(2, "0")}:${d
              .getUTCMinutes()
              .toString()
              .padStart(2, "0")}`,
            sendNow: false,
          });
        } else {
          form.reset({
            type: initialData.type || "",
            date: "",
            time: "",
            sendNow: true,
          });
        }
      } else {
        form.reset({
          type: "",
          date: "",
          time: "",
          sendNow: false,
        });
      }
    }
  }, [form, initialData, open]);
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

            {!form.watch("sendNow") && (
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
            )}

            {allowSendNow && (
              <FormField
                control={form.control}
                name="sendNow"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    </FormControl>
                    <FormLabel>{t("modal.sendNow")}</FormLabel>
                  </FormItem>
                )}
              />
            )}

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
