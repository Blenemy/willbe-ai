"use client";

import { useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ProductsAndServices } from "@/types/Company";
import { useCompany } from "@/hooks/useCompany";
import { useTranslations } from "next-intl";
import { NOT_ONLY_SPACES_REGEX } from "@/constants/passwordRegex";

const EditProductDialog = ({
  open,
  setOpen,
  product,
}: {
  open: boolean;
  setOpen: (o: boolean) => void;
  product: ProductsAndServices | null;
}) => {
  const t = useTranslations("Company");

  const schema = z.object({
    name: z
      .string()
      .min(1, t("validation_required"))
      .max(100, t("validation_name_max"))
      .regex(NOT_ONLY_SPACES_REGEX, {
        message: t("validation_not_only_spaces"),
      }),
    description: z
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
      name: "",
      description: "",
    },
  });

  const { createProductAndService, updateCompanyProductAndService } =
    useCompany({ enableFetch: false });

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        description: product.description,
      });
    } else {
      form.reset({
        name: "",
        description: "",
      });
    }
  }, [product, open, form]);

  function onSubmit(values: { name: string; description: string }) {
    if (product) {
      updateCompanyProductAndService({
        name: values.name,
        description: values.description,
        id: product.id,
      });
    } else {
      createProductAndService({
        name: values.name,
        description: values.description,
      });
    }

    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="min-w-[800px]">
        <DialogHeader>
          <DialogTitle>
            {product ? t("product_edit_title") : t("product_add_title")}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-foreground">
                    {t("product_field_name")}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-foreground">
                    {t("product_field_description")}
                  </FormLabel>
                  <FormControl>
                    <Textarea {...field} className="min-h-[320px]" />
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

export default EditProductDialog;
