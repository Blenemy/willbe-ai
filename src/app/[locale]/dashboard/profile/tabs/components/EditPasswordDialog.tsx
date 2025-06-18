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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/hooks/useAuth";
import { useTranslations } from "next-intl";
import { PASSWORD_REGEX } from "@/constants/passwordRegex";
import { useEffect } from "react";
import { PasswordInput } from "@/components/ui/password-input";

const EditPasswordDialog = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (o: boolean) => void;
}) => {
  const t = useTranslations("Authentication");
  const { updateUserPassword } = useAuth({ enableFetch: false });

  const schema = z
    .object({
      oldPassword: z.string().min(8, { message: t("validation_password_min") }),
      newPassword: z
        .string()
        .min(8, { message: t("validation_password_min") })
        .regex(/^\S+$/, { message: t("validation_password_no_spaces") })
        .regex(PASSWORD_REGEX, { message: t("validation_password_regex") }),
      confirmPassword: z
        .string()
        .min(8, { message: t("validation_password_min") }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("validation_password_match"),
      path: ["confirmPassword"],
    });

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      await updateUserPassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });

      form.reset();
      setOpen(false);
    } catch (err) {
      console.error("Password update failed", err);
    }
  };

  useEffect(() => {
    if (open) {
      form.reset();
    }
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("change_password")}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-foreground">
                    {t("old_password")}
                  </FormLabel>
                  <FormControl>
                    <PasswordInput placeholder={t("old_password")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-foreground">
                    {t("new_password_title")}
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder={t("new_password_title")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-foreground">
                    {t("confirm_password")}
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder={t("confirm_password")}
                      {...field}
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

export default EditPasswordDialog;
