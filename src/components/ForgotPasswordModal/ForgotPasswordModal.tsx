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

const formSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

interface ForgotPasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({
  open,
  onClose,
}: ForgotPasswordModalProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md top-[20%]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Reset your password
          </DialogTitle>
        </DialogHeader>
        <p className="text-gray-600 text-sm">
          Please include your work email to reset your password.
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
                  <FormLabel className="font-semibold">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Please enter your work email..."
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Reset password
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
