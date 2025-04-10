"use client";

import { useSearchParams } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PasswordInput } from "@/components/ui/password-input";
import { cn } from "@/lib/utils";
import { useInvitation } from "@/hooks/useInvitation";
import { PASSWORD_REGEX } from "@/constants/passwordRegex";
import { AuthTranslations } from "@/hooks/translations/getAuthTranslations";

function getSchema(t: AuthTranslations) {
  return z.object({
    firstName: z
      .string()
      .min(2, t.validation_first_name_min)
      .max(50, t.validation_first_name_max)
      .regex(/^[A-Za-z]+$/, t.validation_first_name_regex),
    lastName: z
      .string()
      .min(2, t.validation_last_name_min)
      .max(50, t.validation_last_name_max)
      .regex(/^[A-Za-z]+$/, t.validation_last_name_regex),
    password: z
      .string()
      .min(8, t.validation_password_min)
      .regex(PASSWORD_REGEX, t.validation_password_regex),
  });
}

export default function InvitationForm({
  translations,
}: {
  translations: AuthTranslations;
}) {
  const searchParams = useSearchParams();
  const invitationId = searchParams.get("invitationId");

  const { acceptInvitation } = useInvitation({
    enableFetch: true,
    invitationId,
  });

  const form = useForm({
    resolver: zodResolver(getSchema(translations)),
    defaultValues: {
      firstName: "",
      lastName: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<ReturnType<typeof getSchema>>) => {
    acceptInvitation(values);
  };

  return (
    <div className={cn("flex flex-col gap-6 min-w-[457px]")}>
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-semibold">
            {translations.setup_profile_title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translations.firstname}</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>{translations.lastname}</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>{translations.password}</FormLabel>
                    <FormControl>
                      <PasswordInput {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                {translations.create_profile}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
