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
import { Dispatch, SetStateAction } from "react";
import { useCompanyUsers } from "@/hooks/useCompanyUsers";
import { User } from "@/types/User";
import { useTranslations } from "next-intl";

const schema = z.object({
  role: z.enum(["admin", "member", "super_admin"]),
  position: z.string().min(1, "Position is required"),
});

type Role = "admin" | "member" | "super_admin";

interface EditUserProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  user: User;
}

export const EditCompanyUser = ({ open, setOpen, user }: EditUserProps) => {
  const t = useTranslations("Users");
  const { updateCompanyUsers } = useCompanyUsers({ enableFetch: false });

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      role: user.role as Role,
      position: user.position || "",
    },
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    updateCompanyUsers({ userId: user.id, ...values });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("edit_title")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
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
                          <SelectValue placeholder={t("role_placeholder")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">
                            {t("role_admin")}
                          </SelectItem>
                          <SelectItem value="member">
                            {t("role_member")}
                          </SelectItem>
                          <SelectItem value="super_admin">
                            Super Admin
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

              <Button type="submit">{t("submit_edit")}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
