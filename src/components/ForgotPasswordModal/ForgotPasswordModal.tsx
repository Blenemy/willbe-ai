"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { AuthTranslations } from "@/hooks/translations/getAuthTranslations";

interface ForgotPasswordModalProps {
  open: boolean;
  onClose: () => void;
  translations: AuthTranslations;
}

export default function ForgotPasswordModal({
  open,
  onClose,
  translations,
}: ForgotPasswordModalProps) {
  const { forgotPassword } = useAuth({ enableFetch: false });

  const formSchema = z.object({
    email: z.string().email(translations.validation_email),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    forgotPassword(values.email);
  }

  useEffect(() => {
    if (open) {
      form.reset();
    }
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md top-[20%]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {translations.reset_password}
          </DialogTitle>
        </DialogHeader>
        <p className="text-gray-600 text-sm">
          {translations.reset_password_modal_description}
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    {translations.Email}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder={translations.enter_email} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              {translations.reset_password}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
