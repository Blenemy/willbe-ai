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
import React from "react";

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

const defaultLead = {
  firstName: "Denys",
  lastName: "Zavialov",
  position: "CEO/Co-Founder",
  positionDescription:
    "Consultation and assistance in the implementation of Devops methodology",
  email: "",
  phone: "",
  company: "",
  industry: "IT Services and IT Consulting",
  language: "English",
  locationCountry: "Poland",
  locationCity: "Warsaw, Mazowieckie, Poland",
  subtitle: "",
  summary:
    "DevOps engineer with 10 years of experience building and implementing business solutions for private sector clients. I have knowledge of cloud computing and application development, proven experience in designing, implementing and realizing agile projects. Able to effectively translate business requirements into technical solutions. Passionate about helping organizations get the most out of IT investments, testing, researching, developing and implementing technology. Self-motivated, creative, quick learner.",
  linkedin:
    "https://www.linkedin.com/sales/lead/ACwAAB4i-HABiawIucdn-DB-lB4sl3rehPUBXcw,NAME_SEARCH,nKsY",
};

export default function LeadDetailsPage() {
  const form = useForm({
    resolver: zodResolver(leadSchema),
    defaultValues: defaultLead,
  });

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
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            ["firstName", "First name"],
            ["lastName", "Last name"],
            ["position", "Position"],
            ["positionDescription", "Position description"],
            ["email", "Email"],
            ["phone", "Phone"],
            ["company", "Company"],
            ["industry", "Industry"],
            ["language", "Language"],
            ["locationCountry", "Location country"],
            ["locationCity", "Location city"],
            ["subtitle", "Subtitle"],
          ].map(([name, label]) => (
            <FormField
              key={name}
              control={form.control}
              name={name as keyof typeof defaultLead}
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
