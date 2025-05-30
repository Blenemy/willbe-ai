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
  FormMessage,
} from "@/components/ui/form";
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { LeadDetails, useLeadsPage } from "@/hooks/useLeadsPage";
import { useAuthStore } from "@/store/useAuthStore";
import Image from "next/image";
import isConnectedHubspot from "@/assets/hubspot_orange.svg";
import isNotConnectedHubspot from "@/assets/hubspot_grey.svg";
import { ConfirmationModal } from "../../profile/hubspot-settings/components/ConfirmationModal";

const leadSchema = z.object({
  email: z.string().email("Invalid email address"),

  firstName: z.string().optional().or(z.literal("")),
  lastName: z.string().optional().or(z.literal("")),
  position: z.string().optional().or(z.literal("")),
  positionDescription: z.string().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  company: z.string().optional().or(z.literal("")),
  industry: z.string().optional().or(z.literal("")),
  language: z.string().optional().or(z.literal("")),
  locationCountry: z.string().optional().or(z.literal("")),
  locationCity: z.string().optional().or(z.literal("")),
  subtitle: z.string().optional().or(z.literal("")),
  summary: z.string().optional().or(z.literal("")),
  linkedin: z.string().optional().or(z.literal("")),
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
  { name: "locationCountry", label: "Location country" },
  { name: "locationCity", label: "Location city" },
];

export type LeadFormData = z.infer<typeof leadSchema>;

export const normalizeLeadData = (lead: LeadDetails): LeadFormData => {
  return {
    email: lead.email ?? "",
    firstName: lead.firstName ?? "",
    lastName: lead.lastName ?? "",
    position: lead.position ?? "",
    positionDescription: lead.positionDescription ?? "",
    phone: lead.phone ?? "",
    company: lead.company ?? "",
    industry: lead.industry ?? "",
    language: lead.language ?? "",
    locationCountry: lead.locationCountry ?? "",
    locationCity: lead.locationCity ?? "",
    subtitle: lead.subtitle ?? "",
    summary: lead.summary ?? "",
    linkedin: lead.linkedin ?? "",
  };
};

export default function LeadDetailsPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const isNew = id === "new-lead";
  const {
    data: lead,
    updateLead,
    createLead,
  } = useLeadsPage(!isNew ? (id as string) : undefined);
  const { user } = useAuthStore();
  const [showConfirm, setShowConfirm] = useState(false);
  const searchParams = useSearchParams();
  const accountId = searchParams.get("accountId") as string;

  const isAccountConnectedToHubspot = lead?.isConnectedToHubspot;

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
    if (!isNew && lead) {
      form.reset(normalizeLeadData(lead));
    }
  }, [lead, form, isNew]);

  const onSubmit = (values: z.infer<typeof leadSchema>) => {
    if (isNew) {
      createLead({ ...values, accountId });
    } else {
      updateLead(values);
    }
  };

  if (!user) {
    return <div>No user was found</div>;
  }

  return (
    <div className="p-6 space-y-4 bg-white rounded-md">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">
          {isNew ? "Create New Lead" : "Lead page"}
        </h2>

        {!isNew && (
          <div className="flex gap-2">
            <div className="flex gap-3 items-center bg-[#F8F9FB] px-2 rounded-md">
              <Image
                width={20}
                height={20}
                alt="hubspot_icon"
                src={
                  isAccountConnectedToHubspot
                    ? isConnectedHubspot
                    : isNotConnectedHubspot
                }
              />
              <p>
                This account is {isAccountConnectedToHubspot ? "" : "not"}{" "}
                connected to HubSpot
              </p>
            </div>

            <Button
              type="button"
              className="max-w-fit min-w-24 h-8 bg-[#030A27]"
              onClick={() => setShowConfirm(true)}
            >
              Sync
            </Button>
          </div>
        )}
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
                  <FormLabel className="text-foreground">{label}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Language</FormLabel>
                <FormControl className="text-foreground">
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subtitle"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel className="text-foreground">Subtitle</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="summary"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel className="text-foreground">Summary</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={5} />
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
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="col-span-2 flex justify-start">
            <Button type="submit" className="max-w-fit min-w-24">
              Save
            </Button>
          </div>
        </form>
      </Form>

      <ConfirmationModal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        companyId={id}
        withEnrichOnly
        leadPage
      />
    </div>
  );
}
