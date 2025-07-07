"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Company } from "@/types/Company";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCompany } from "@/hooks/useCompany";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Textarea } from "@/components/ui/textarea";
import { NOT_ONLY_SPACES_REGEX } from "@/constants/passwordRegex";

const EditCompanyDescriptionDialog = ({
  open,
  setOpen,
  company,
}: {
  open: boolean;
  setOpen: (o: boolean) => void;
  company: Company;
}) => {
  const t = useTranslations("Company");

  const schema = z.object({
    companyDescription: z
      .string()
      .min(1, t("validation_required"))
      .max(3000, t("validation_description_max"))
      .regex(NOT_ONLY_SPACES_REGEX, {
        message: t("validation_not_only_spaces"),
      }),
  });

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      companyDescription: company.description || "",
    },
  });

  const { updateCompany } = useCompany({ enableFetch: false });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    updateCompany({
      name: company.name,
      description: values.companyDescription,
      sector: company.sector,
    });
    setOpen(false);
  };

  useEffect(() => {
    if (open) {
      form.reset({
        companyDescription: company?.description || "",
      });
      form.clearErrors();
    }
  }, [open, company, form]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="min-w-[800px]">
        <DialogHeader>
          <DialogTitle>{t("company_description")}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="companyDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-foreground">
                    {t("company_description")}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("company_description_placeholder")}
                      {...field}
                      className="min-h-[320px]"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                {t("cancel")}
              </Button>
              <Button type="submit">{t("save")}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCompanyDescriptionDialog;
