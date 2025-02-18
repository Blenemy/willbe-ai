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

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z
    .string()
    .min(8, "A password must have at least 8 characters")
    .max(128, "A password must have a maximum of 128 characters"),
  remember: z.boolean(),
});

const signUpSchema = signInSchema
  .extend({
    confirmPassword: z
      .string()
      .min(8, "A password must have at least 8 characters")
      .max(128, "A password must have a maximum of 128 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export function AuthForm({
  className,
  defaultMode = "sign-in",
  ...props
}: {
  className?: string;
  defaultMode?: "sign-in" | "sign-up";
}) {
  const [mode, setMode] = useState<"sign-in" | "sign-up">(defaultMode);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const isSignIn = mode === "sign-in";

  const form = useForm({
    resolver: zodResolver(isSignIn ? signInSchema : signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      remember: false,
    },
  });

  function onSubmit(values: z.infer<typeof signUpSchema>) {
    console.log(values);
  }

  return (
    <div
      className={cn("flex flex-col gap-6 min-w-[457px]", className)}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-semibold">
            {isSignIn ? "Welcome back to Willbe 🙂" : "Welcome to Willbe 🙂"}
          </CardTitle>
          <CardDescription className="text-black">
            {isSignIn
              ? "Please include your login details"
              : "Create your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your work email..."
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
                      <FormLabel className="font-semibold">Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your password"
                          {...field}
                          type="password"
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
                        <FormLabel className="font-semibold">
                          Confirm password
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Re-enter your password"
                            {...field}
                            type="password"
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
                    <Label htmlFor="remember">Remember me</Label>
                  </div>

                  <Button
                    variant={"link"}
                    className="underline"
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(true)}
                  >
                    I have forgotten my password
                  </Button>
                </div>

                <Button type="submit" className="w-full">
                  {isSignIn ? "Login" : "Sign Up"}
                </Button>
              </div>

              <div className="mt-4 text-center text-sm">
                {isSignIn
                  ? "Don't have an account?"
                  : "Already have an account?"}{" "}
                <Button
                  type="button"
                  variant={"link"}
                  className="no-underline"
                  onClick={() => setMode(isSignIn ? "sign-up" : "sign-in")}
                >
                  {isSignIn ? "Sign Up" : "Login"}
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
