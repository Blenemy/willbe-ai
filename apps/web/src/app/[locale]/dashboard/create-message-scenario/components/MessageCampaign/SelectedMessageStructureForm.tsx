"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { protectedAxiosInstance } from "@/api/axiosInstance";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const formSchema = z.object({
  messageStructureId: z.string().min(1, "Please select a message structure"),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  entryId: string | null;
  selectedStructureId: string | null;
  structures:
    | {
        id: string;
        name: string;
        templates: { language: string }[];
      }[]
    | null;
}

export const SelectMessageStructureForm = ({
  entryId,
  selectedStructureId,
  structures,
}: Props) => {
  const t = useTranslations("messageChain.structureForm");
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      messageStructureId: selectedStructureId || "",
    },
  });

  const { mutate: updateStructure, isPending } = useMutation({
    mutationFn: async (data: FormValues) => {
      return await protectedAxiosInstance.patch(
        `/auth/message-campaign-entries/follow-up/${entryId}`,
        {
          messageStructureId: data.messageStructureId,
        }
      );
    },
    onSuccess: () => {
      toast(t("success"));
    },
    onError: (error) => {
      toast(`${t("error")}: ${error.message}`);
    },
  });

  const onSubmit = (data: FormValues) => {
    updateStructure(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 flex flex-col"
      >
        <FormField
          control={form.control}
          name="messageStructureId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("label")}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("placeholder")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {structures?.map((structure) => (
                    <SelectItem key={structure.id} value={structure.id}>
                      {structure.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="self-center">
          {t("button")}
        </Button>
      </form>
    </Form>
  );
};
