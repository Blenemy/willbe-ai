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
import { NOT_ONLY_SPACES_REGEX } from "@/constants/passwordRegex";
import { AuthTranslations } from "@/hooks/translations/getAuthTranslations";
import {
  OrDivider,
  SocialAuthButtons,
} from "../SocialMediaButtons/SocialMediaButtons";
import Logo from "../Logo/Logo";

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
        .regex(NOT_ONLY_SPACES_REGEX, t["validation_password_regex"]),
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
        acceptPolicy: z.literal(true, {
          errorMap: () => ({ message: t["validation_accept_policy"] }),
        }),
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: t["validation_password_match"],
        path: ["confirmPassword"],
      });
  }

  const [mode] = useState<"sign-in" | "sign-up">(defaultMode);
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
      acceptPolicy: false,
    },
  });

  function onSubmit(values: z.infer<typeof signUpSchema>) {
    const { email, password, firstName, lastName, remember } = values;

    if (isSignIn) {
      login({ email, password, rememberMe: remember });
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
        <CardHeader className="px-10 pt-10 pb-0 mb-8">
          <div className="flex items-center justify-center mb-8">
            <Logo width={150} height={60} />
          </div>

          <CardTitle className="text-3xl font-semibold text-center">
            {isSignIn ? translations.welcome_back : translations.welcome}
          </CardTitle>
          <CardDescription className="text-center text-[#5F5F5F]">
            {isSignIn
              ? translations.please_include_login
              : translations.new_password}
          </CardDescription>
        </CardHeader>

        <div className="px-10">
          {!isSignIn && (
            <>
              <SocialAuthButtons translations={translations} />
              <OrDivider />
            </>
          )}
        </div>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-5">
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
                          {translations.confirm_password}
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
                  {isSignIn ? (
                    <>
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
                        <Label htmlFor="remember">
                          {translations.remember_me}
                        </Label>
                      </div>

                      <Button
                        variant={"link"}
                        className="underline"
                        type="button"
                        onClick={() => setIsForgotPasswordOpen(true)}
                      >
                        {translations.forgot_password}
                      </Button>
                    </>
                  ) : (
                    <div className="flex gap-1 items-center">
                      <FormField
                        control={form.control}
                        name="acceptPolicy"
                        render={({ field, fieldState }) => (
                          <FormItem className="flex flex-col gap-1">
                            <div className="flex items-center space-x-2">
                              <FormControl>
                                <Checkbox
                                  id="acceptPolicy"
                                  checked={!!field.value}
                                  onCheckedChange={field.onChange}
                                  className={cn(
                                    "border-2",
                                    fieldState.invalid
                                      ? "border-red-500"
                                      : "border-border"
                                  )}
                                />
                              </FormControl>
                              <FormLabel
                                htmlFor="acceptPolicy"
                                className="text-sm font-normal text-foreground"
                              >
                                {translations.accept_policy_label_start}{" "}
                                <a
                                  href="/terms"
                                  className="underline font-semibold"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {translations.terms_of_service}
                                </a>{" "}
                                {translations.accept_policy_label_and}{" "}
                                <a
                                  href="/privacy"
                                  className="underline font-semibold"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {translations.privacy_policy}
                                </a>
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#030A27] rounded-lg"
                >
                  {isSignIn ? translations.login : translations.signup}
                </Button>
              </div>
            </form>
          </Form>

          {isSignIn && (
            <div className="mb-8">
              <OrDivider />
              <SocialAuthButtons translations={translations} />
            </div>
          )}

          <div className="mt-4 text-center text-sm text-[#5F5F5F]">
            {isSignIn
              ? `${translations.dont_have_account} `
              : `${translations.already_have_account} `}
            <Button
              type="button"
              variant={"link"}
              className="no-underline p-0"
              onClick={() => setMode(isSignIn ? "sign-up" : "sign-in")}
            >
              {isSignIn ? translations.signup : translations.login}
            </Button>
          </div>
        </CardContent>
      </Card>

      <ForgotPasswordModal
        open={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
        translations={translations}
      />
    </div>
  );
}
