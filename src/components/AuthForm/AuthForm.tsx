// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck

"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import ForgotPasswordModal from "../ForgotPasswordModal/ForgotPasswordModal";
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
import { useAuth } from "@/hooks/useAuth";
import { PasswordInput } from "../ui/password-input";
import { PASSWORD_REGEX } from "@/constants/passwordRegex";
import { AuthTranslations } from "@/hooks/translations/getAuthTranslations";

export function AuthForm({
  translations,
  className,
  defaultMode = "sign-in",
  ...props
}: {
  translations: AuthTranslations;
  className?: string;
  defaultMode?: "sign-in" | "sign-up";
}) {
  function getSignInSchema(t: AuthTranslations) {
    return z.object({
      email: z.string().email(t["validation_email"]),
      password: z
        .string()
        .min(8, t["validation_password_min"])
        .max(64, t["validation_password_max"])
        .regex(PASSWORD_REGEX, t["validation_password_regex"]),
      remember: z.boolean(),
    });
  }

  function getSignUpSchema(t: AuthTranslations) {
    return getSignInSchema(t)
      .extend({
        firstName: z
          .string()
          .min(2, t["validation_first_name_min"])
          .max(50, t["validation_first_name_max"])
          .regex(/^[A-Za-z]+$/, t["validation_first_name_regex"]),
        lastName: z
          .string()
          .min(2, t["validation_last_name_min"])
          .max(50, t["validation_last_name_max"])
          .regex(/^[A-Za-z]+$/, t["validation_last_name_regex"]),
        confirmPassword: z
          .string()
          .min(8, t["validation_password_min"])
          .max(64, t["validation_password_max"]),
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: t["validation_password_match"],
        path: ["confirmPassword"],
      });
  }

  const [mode, setMode] = useState<"sign-in" | "sign-up">(defaultMode);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const { login, register } = useAuth({ enableFetch: false });

  const isSignIn = mode === "sign-in";
  const schema = isSignIn
    ? getSignInSchema(translations)
    : getSignUpSchema(translations);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      confirmPassword: "",
      remember: false,
    },
  });

  function onSubmit(values: z.infer<typeof signUpSchema>) {
    const { email, password, firstName, lastName } = values;

    if (isSignIn) {
      login({ email, password });
    } else {
      register({ email, password, firstName, lastName });
    }
  }

  return (
    <div
      className={cn("flex flex-col gap-6 min-w-[457px]", className)}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-semibold">
            {isSignIn ? translations.welcome_back : translations.welcome}
          </CardTitle>
          <CardDescription className="text-black">
            {isSignIn
              ? translations.please_include_login
              : translations.new_password}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                {!isSignIn && (
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-foreground">
                          {translations.firstname}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={translations.firstname}
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {!isSignIn && (
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-foreground">
                          {translations.lastname}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={translations.lastname}
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-foreground">
                        {translations.Email}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={translations.enter_email}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-foreground">
                        {translations.password}
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder={translations.enter_password}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {!isSignIn && (
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
                            placeholder="Re-enter your password"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="flex justify-between items-center">
                  <div className="flex gap-1 items-center">
                    <FormField
                      control={form.control}
                      name="remember"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              id="remember"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Label htmlFor="remember">{translations.remember_me}</Label>
                  </div>

                  <Button
                    variant={"link"}
                    className="underline"
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(true)}
                  >
                    {translations.forgot_password}
                  </Button>
                </div>

                <Button type="submit" className="w-full">
                  {isSignIn ? translations.login : translations.signup}
                </Button>
              </div>

              <div className="mt-4 text-center text-sm">
                {isSignIn
                  ? `${translations.dont_have_account} `
                  : `${translations.already_have_account} `}
                <Button
                  type="button"
                  variant={"link"}
                  className="no-underline"
                  onClick={() => setMode(isSignIn ? "sign-up" : "sign-in")}
                >
                  {isSignIn ? translations.signup : translations.login}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <ForgotPasswordModal
        open={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
      />
    </div>
  );
}
