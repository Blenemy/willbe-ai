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

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-semibold">
            Welcome back to Willbe 🙂
          </CardTitle>
          <CardDescription className="text-black">
            {isSignIn
              ? "Please enter your login details"
              : "Create your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label className="font-semibold" htmlFor="email">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label className="font-semibold" htmlFor="password">
                  Password
                </Label>
                <Input id="password" type="password" required />
              </div>

              <div className="flex justify-between items-center">
                <div className="flex gap-1 items-center">
                  <Checkbox id="remember" />
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
              {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
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
        </CardContent>
      </Card>

      <ForgotPasswordModal
        open={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
      />
    </div>
  );
}
