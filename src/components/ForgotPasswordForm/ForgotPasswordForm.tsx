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

const schema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(PASSWORD_REGEX, "Password contains forbidden characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function ForgotPasswordForm({
  className,
  ...props
}: {
  className?: string;
}) {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { resetPassword } = useAuth({ enableFetch: false });
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof schema>) {
    const { newPassword } = values;

    if (!token) {
      return;
    }

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
            Reset your password
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
                        New password
                      </FormLabel>
                      <FormControl>
                        <PasswordInput placeholder="New password" {...field} />
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
                        Confirm password
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="Confirm password"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Reset your password
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
