"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { PasswordInput } from "../ui/password-input";
import { PASSWORD_REGEX } from "@/constants/passwordRegex";
import { AuthTranslations } from "@/hooks/translations/getAuthTranslations";

function getSchema(t: AuthTranslations) {
  return z
    .object({
      newPassword: z
        .string()
        .min(8, t.validation_password_min)
        .regex(PASSWORD_REGEX, t.validation_password_regex),
      confirmPassword: z.string().min(8, t.validation_password_min),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t.validation_password_match,
      path: ["confirmPassword"],
    });
}

export function ForgotPasswordForm({
  className,
  translations,
  ...props
}: {
  translations: AuthTranslations;
  className?: string;
}) {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { resetPassword } = useAuth({ enableFetch: false });

  const form = useForm({
    resolver: zodResolver(getSchema(translations)),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: z.infer<ReturnType<typeof getSchema>>) {
    const { newPassword } = values;
    if (!token) return;

    resetPassword({ token, password: newPassword });
  }

  return (
    <div
      className={cn("flex flex-col gap-6 min-w-[457px]", className)}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-semibold">
            {translations.reset_password}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-foreground">
                        {translations.new_password_title}
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder={translations.new_password_title}
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
                        {translations.confirm_password}
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder={translations.confirm_password}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  {translations.reset_password}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
