"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useSignature } from "@/hooks/useSignature";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  signatureField: z.string(),
});

const SignatureForm = () => {
  const { signature, updateUserSignature, isLoading } = useSignature({
    enableFetch: true,
  });

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      signatureField: "",
    },
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    updateUserSignature({ body: values.signatureField });
  };

  useEffect(() => {
    if (signature?.body) {
      form.setValue("signatureField", signature.body);
    }
  }, [signature, form]);

  if (isLoading) {
    return <Skeleton className="w-full h-32" />;
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="signatureField"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-foreground text-xl">
                Your signature
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter your email signature in html format"
                  id="message"
                  className="min-h-40"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="max-w-64">
          Submit your signature
        </Button>
      </form>
    </Form>
  );
};

export default SignatureForm;
