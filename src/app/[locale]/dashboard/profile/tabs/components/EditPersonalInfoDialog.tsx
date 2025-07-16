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
import { useAuth } from "@/hooks/useAuth";
import { useLocale, useTranslations } from "next-intl";
import { User } from "@/types/User";
import { NO_SPACES_REGEX } from "@/constants/passwordRegex";

const EditPersonalInfoDialog = ({
  open,
  setOpen,
  user,
}: {
  open: boolean;
  setOpen: (o: boolean) => void;
  user: User;
}) => {
  const t = useTranslations("Authentication");
  const { updateUser } = useAuth({ enableFetch: false });
  const locale = useLocale();

  const schema = z.object({
    firstName: z
      .string()
      .min(1, t("validation_required"))
      .max(50, t("validation_max"))
      .regex(NO_SPACES_REGEX, {
        message: t("validation_password_no_spaces"),
      }),
    lastName: z
      .string()
      .min(1, t("validation_required"))
      .regex(NO_SPACES_REGEX, {
        message: t("validation_password_no_spaces"),
      }),
  });

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    updateUser({ ...values, language: locale });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("personal_info")}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    {t("firstname")}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder={t("firstname")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    {t("lastname")}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder={t("lastname")} {...field} />
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

export default EditPersonalInfoDialog;
