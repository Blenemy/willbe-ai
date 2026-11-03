"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useCompanyUsers } from "@/hooks/useCompanyUsers";
import { Dispatch, SetStateAction } from "react";
import { useTranslations } from "next-intl";

type Role = "admin" | "member";

const CreateCompanyUsers = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const t = useTranslations("Users");

  const schema = z.object({
    email: z.string().email(t("validation_email")),
    role: z.enum(["admin", "member"]),
    position: z.string().min(1, t("validation_position_required")),
  });

  const { createCompanyUsers } = useCompanyUsers({ enableFetch: true });

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      role: "member" as Role,
      position: "",
    },
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    createCompanyUsers(values);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("invite_title")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("email")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("email_placeholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("role")}</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t("select_role")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">
                            {t("role_admin")}
                          </SelectItem>
                          <SelectItem value="member">
                            {t("role_member")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("position")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("position_placeholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">{t("invite_button")}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export { CreateCompanyUsers };
