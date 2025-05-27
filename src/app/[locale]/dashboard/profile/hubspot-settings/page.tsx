/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm, UseFormReturn } from "react-hook-form";
import { ArrowRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  Form,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  HubspotField,
  useHubspotSettingsData,
  useUpdateHubspotBindings,
} from "@/hooks/useConnectHubspot";
import React, { useEffect, useMemo, useState } from "react";
import { ConfirmationModal } from "./components/ConfirmationModal";
import { toast } from "sonner";
import Image from "next/image";
import hubspotImage from "@/assets/hubspot_orange.svg";
import { AutoEnrichSelect } from "./components/AutoEnrichSelect";
import { GoBackButton } from "@/components/GoBackButton/GoBackButton";

const leadSyncFields = {
  info: [
    { label: "First name", key: "crmLeadFirstNameField" },
    { label: "Last name", key: "crmLeadLastNameField" },
    { label: "Position", key: "crmLeadPositionField" },
    { label: "Position description", key: "crmLeadPositionDescriptionField" },
    { label: "Email", key: "crmLeadEmailField" },
    { label: "Phone", key: "crmLeadPhoneField" },
    { label: "Company", key: "crmLeadCompanyField" },
    { label: "Language", key: "crmLeadLanguageField" },
    { label: "Location country", key: "crmLeadLocationCountryField" },
    { label: "Location city", key: "crmLeadLocationCityField" },
    { label: "Subtitle", key: "crmLeadSubtitleField" },
    { label: "Summary", key: "crmLeadSummaryField" },
    { label: "LinkedIn", key: "crmLeadLinkedInField" },
  ],
  status: [
    { label: "Not contacted", key: "crmLeadNotContactedStatus" },
    { label: "In cadence", key: "crmLeadInCadenceStatus" },
    { label: "Response", key: "crmLeadResponseStatus" },
    { label: "Meeting", key: "crmLeadMeetingStatus" },
    { label: "Bounced", key: "crmLeadBouncedStatus" },
    { label: "Out of office", key: "crmLeadOutOfOfficeStatus" },
    { label: "Unresponsive", key: "crmLeadUnresponsiveStatus" },
  ],
  accountStatus: [
    { label: "Not contacted", key: "crmAccountNotContactedStatus" },
    { label: "In cadence", key: "crmAccountInCadenceStatus" },
    { label: "Response", key: "crmAccountResponseStatus" },
    { label: "Meeting", key: "crmAccountMeetingStatus" },
    { label: "Bounced", key: "crmAccountBouncedStatus" },
    { label: "Out of office", key: "crmAccountOutOfOfficeStatus" },
    { label: "Unresponsive", key: "crmAccountUnresponsiveStatus" },
  ],
  account: [
    { label: "Company title", key: "crmAccountNameField" },
    { label: "Founded in", key: "crmAccountFoundedInField" },
    { label: "Headquarters", key: "crmAccountHeadquartersField" },
    { label: "Employees", key: "crmAccountEmployeesField" },
    { label: "Industry", key: "crmAccountIndustryField" },
    { label: "Website", key: "crmAccountWebsiteField" },
    { label: "LinkedIn", key: "crmAccountLinkedInField" },
    { label: "Description", key: "crmAccountDescriptionField" },
  ],
} satisfies {
  info: { label: string; key: string }[];
  status: { label: string; key: string }[];
  account: { label: string; key: string }[];
  accountStatus: { label: string; key: string }[];
};

const FieldsGroup = React.memo(function FieldsGroup({
  form,
  fields,
  title,
  options,
  isStatusField,
}: {
  form: UseFormReturn<Record<string, string | null>>;
  fields: { label: string; key: string }[];
  title: string;
  options: Record<string, HubspotField[] | undefined>;
  isStatusField?: boolean;
}) {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <div className="space-y-4">
        {fields.map(({ label, key }) => {
          const fieldOptions = options[key] || [];

          return (
            <FormField
              key={key}
              control={form.control}
              name={key}
              render={({ field }) => {
                const selectedOption = isStatusField
                  ? fieldOptions.find((f: any) => f.value === field.value)
                  : fieldOptions.find((f: any) => f.name === field.value);

                return (
                  <FormItem className="flex items-center gap-4">
                    <FormLabel className="w-56 text-sm text-foreground">
                      {label}
                    </FormLabel>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                      >
                        <SelectTrigger className="w-full">
                          {selectedOption?.label ||
                            field.value ||
                            "Choose an option"}
                        </SelectTrigger>
                        <SelectContent>
                          {fieldOptions.length > 0 ? (
                            fieldOptions.map((opt: any) => (
                              <SelectItem
                                key={isStatusField ? opt.value : opt.name}
                                value={isStatusField ? opt.value : opt.name}
                              >
                                {opt.label}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="placeholder" disabled>
                              No options available
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                );
              }}
            />
          );
        })}
      </div>
    </div>
  );
});

const HubspotSettings = () => {
  const { contactsFields, bindings, companiesFields } =
    useHubspotSettingsData();
  const [showConfirm, setShowConfirm] = useState(false);
  const { mutateAsync } = useUpdateHubspotBindings();

  const defaultValues = useMemo(() => {
    if (!bindings) return {};
    const result: Record<string, string | null> = {};
    Object.entries(bindings).forEach(([key, val]) => {
      if (typeof val === "string" || val === null) {
        result[key] = val;
      }
    });
    return result;
  }, [bindings]);

  const leadInfoFields = useMemo(() => leadSyncFields.info, []);
  const leadStatusFields = useMemo(() => leadSyncFields.status, []);
  const accountInfoFields = useMemo(() => leadSyncFields.account, []);
  const accountStatusFields = useMemo(() => leadSyncFields.accountStatus, []);

  const form = useForm<Record<string, string | null>>({
    defaultValues,
  });

  console.count("FieldsGroup rendered");
  console.count("HubspotSettings rendered");

  const onSubmit = async (data: Record<string, string | null>) => {
    if (!bindings?.companyId) return;

    const filteredData: Record<string, string> = Object.fromEntries(
      Object.entries(data)
        .filter(([, value]) => typeof value === "string" && value !== null)
        .map(([key, value]) => [key, value as string])
    );

    try {
      await mutateAsync({ companyId: bindings.companyId, data: filteredData });
      setShowConfirm(true);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast(`Failed to update bindings: ${error.message}`);
      } else {
        toast("An unknown error occurred.");
      }
    }
  };

  useEffect(() => {
    if (bindings && (contactsFields || companiesFields)) {
      const values: Record<string, string | null> = {};
      Object.entries(bindings).forEach(([key, val]) => {
        if (typeof val === "string" || val === null) {
          values[key] = val;
        }
      });

      form.reset(values);
    }
  }, [bindings, contactsFields, companiesFields, form]);

  return (
    <div className="w-full px-6 py-6">
      <h2 className="text-2xl font-semibold mb-6">Account Settings</h2>

      <div className="mb-6">
        <GoBackButton />
      </div>

      <div className="text-2xl font-semibold mb-5 flex flex-col gap-3">
        <div className="flex gap-2">
          <Image alt="hubspot-icon" src={hubspotImage} width={24} height={24} />
          <h3>HubSpot Sync Settings</h3>
        </div>

        <p className="text-[#5F5F5F] mb-6 text-sm font-normal">
          Match Willbe fields with your HubSpot properties to ensure accurate
          data sync.
        </p>
      </div>

      <AutoEnrichSelect defaultValue={bindings?.isAutoSync} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <Tabs defaultValue="lead" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="lead">🙋‍♀️ Lead</TabsTrigger>
              <TabsTrigger value="account">🏢 Account</TabsTrigger>
            </TabsList>

            <TabsContent value="lead">
              <FieldsGroup
                form={form}
                fields={leadInfoFields}
                title="Info"
                options={contactsFields || {}}
              />
              <FieldsGroup
                form={form}
                fields={leadStatusFields}
                title="Status"
                options={contactsFields || {}}
                isStatusField
              />
            </TabsContent>

            <TabsContent value="account">
              <FieldsGroup
                form={form}
                fields={accountInfoFields}
                title="Info"
                options={companiesFields || {}}
              />
              <FieldsGroup
                form={form}
                fields={accountStatusFields}
                title="Status"
                options={companiesFields || {}}
                isStatusField
              />
            </TabsContent>
          </Tabs>

          <div className="mt-8">
            <Button type="submit" className="bg-[#084960] text-white">
              Save
            </Button>
          </div>
        </form>
      </Form>

      <ConfirmationModal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        companyId={bindings?.companyId}
      />
    </div>
  );
};

export default HubspotSettings;
