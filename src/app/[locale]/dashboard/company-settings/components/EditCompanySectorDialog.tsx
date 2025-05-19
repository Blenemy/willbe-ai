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

const EditCompanySectorDialog = ({
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
    companySector: z
      .string()
      .min(1, t("validation_required"))
      .max(60, t("validation_sector_max")),
  });

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      companySector: company.sector || "",
    },
  });

  const { updateCompany } = useCompany({ enableFetch: false });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    updateCompany({
      name: company.name,
      description: company.description,
      sector: values.companySector,
    });
    setOpen(false);
  };

  useEffect(() => {
    if (open) {
      form.reset({
        companySector: company?.sector || "",
      });
      form.clearErrors();
    }
  }, [open, company, form]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("company_sector")}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="companySector"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-foreground">
                    {t("company_sector")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("company_sector_placeholder")}
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

export default EditCompanySectorDialog;
