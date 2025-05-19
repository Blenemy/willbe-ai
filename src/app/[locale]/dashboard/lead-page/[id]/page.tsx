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
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useLeadsPage } from "@/hooks/useLeadsPage";
import { useAuthStore } from "@/store/useAuthStore";
import Image from "next/image";
import isConnectedHubspot from "@/assets/hubspot_orange.svg";
import isNotConnectedHubspot from "@/assets/hubspot_grey.svg";
import { ConfirmationModal } from "../../profile/hubspot-settings/components/ConfirmationModal";

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
  { name: "locationCountry", label: "Location country" },
  { name: "locationCity", label: "Location city" },
];

export default function LeadDetailsPage() {
  const { id } = useParams();
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
      form.reset(lead);
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
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
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
                <FormControl>
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
                <FormLabel>Subtitle</FormLabel>
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
                <FormLabel>Summary</FormLabel>
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
            <Button className="max-w-fit min-w-24">Save</Button>
          </div>
        </form>
      </Form>

      <ConfirmationModal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        companyId={user.companyId}
      />
    </div>
  );
}
