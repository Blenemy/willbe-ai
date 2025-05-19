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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Company } from "@/types/Company";
import { useCompany } from "@/hooks/useCompany";
import { useEffect } from "react";
import { useTranslations } from "next-intl";

const EditCompanyNameDialog = ({
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
    companyName: z
      .string()
      .min(1, t("validation_required"))
      .max(50, t("validation_max_length")),
  });

  const form = useForm({
    resolver: zodResolver(
      schema.transform((val) => ({
        companyName: val.companyName,
      }))
    ),
    defaultValues: {
      companyName: company.name || "",
    },
  });

  const { updateCompany } = useCompany({ enableFetch: false });

  const onSubmit = (values: z.infer<typeof schema>) => {
    updateCompany({
      name: values.companyName,
      description: company.description,
      sector: company.sector,
    });
    setOpen(false);
  };

  useEffect(() => {
    if (open) {
      form.reset({
        companyName: company?.name || "",
      });
      form.clearErrors();
    }
  }, [open, company, form]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent aria-describedby="companyName">
        <DialogHeader>
          <DialogTitle>{t("company_name")}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-foreground">
                    {t("company_name")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("company_name_placeholder")}
                      {...field}
                      type="text"
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

export default EditCompanyNameDialog;
