"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { AlertCircle } from "lucide-react";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useLeadsPage } from "@/hooks/useLeadsPage";

const leadSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  position: z.string(),
  positionDescription: z.string(),
  email: z.string(),
  phone: z.string(),
  company: z.string(),
  industry: z.string(),
  language: z.string(),
  locationCountry: z.string(),
  locationCity: z.string(),
  subtitle: z.string(),
  summary: z.string(),
  linkedin: z.string().url(),
});

type LeadFormFields = keyof z.infer<typeof leadSchema>;

const fields: { name: LeadFormFields; label: string }[] = [
  { name: "firstName", label: "First name" },
  { name: "lastName", label: "Last name" },
  { name: "position", label: "Position" },
  { name: "positionDescription", label: "Position description" },
  { name: "email", label: "Email" },
  { name: "phone", label: "Phone" },
  { name: "company", label: "Company" },
  { name: "industry", label: "Industry" },
  { name: "language", label: "Language" },
  { name: "locationCountry", label: "Location country" },
  { name: "locationCity", label: "Location city" },
  { name: "subtitle", label: "Subtitle" },
];

export default function LeadDetailsPage() {
  const { id } = useParams();
  const { data: lead, updateLead } = useLeadsPage(id as string);

  const form = useForm({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      position: "",
      positionDescription: "",
      email: "",
      phone: "",
      company: "",
      industry: "",
      language: "",
      locationCountry: "",
      locationCity: "",
      subtitle: "",
      summary: "",
      linkedin: "",
    },
  });

  useEffect(() => {
    if (lead) {
      form.reset(lead);
    }
  }, [lead, form]);

  const onSubmit = (values: z.infer<typeof leadSchema>) => {
    updateLead(values);
  };

  return (
    <div className="p-6 space-y-4 bg-white rounded-md">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Lead page</h2>
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          This lead is not connected to HubSpot
        </div>
      </div>

      <Form {...form}>
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {fields.map(({ name, label }) => (
            <FormField
              key={name}
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly />
                  </FormControl>
                </FormItem>
              )}
            />
          ))}

          <FormField
            control={form.control}
            name="summary"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Summary</FormLabel>
                <FormControl>
                  <Textarea {...field} readOnly rows={5} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="linkedin"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>LinkedIn</FormLabel>
                <FormControl>
                  <Input {...field} readOnly />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="col-span-2 flex justify-start">
            <Button disabled className="max-w-fit min-w-24">
              Save
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
