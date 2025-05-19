"use client";

import { useForm } from "react-hook-form";
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
import { useEffect, useState } from "react";
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
    { label: "Not contacted", key: "crmLeadNotContactedField" },
    { label: "In cadence", key: "crmLeadInCadenceField" },
    { label: "Response", key: "crmLeadResponseField" },
    { label: "Meeting", key: "crmLeadMeetingField" },
    { label: "Bounced", key: "crmLeadBouncedField" },
    { label: "Out of office", key: "crmLeadOutOfOfficeField" },
    { label: "Unresponsive", key: "crmLeadUnresponsiveField" },
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
};

const renderFields = (
  form: ReturnType<typeof useForm<Record<string, string | null>>>,
  fields: { label: string; key: string }[],
  title: string,
  options: Record<string, HubspotField[] | undefined>
) => (
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
                        {field.value
                          ? fieldOptions.find((f) => f.name === field.value)
                              ?.label ?? field.value
                          : "Choose an option"}
                      </SelectTrigger>
                      <SelectContent>
                        {fieldOptions.length > 0 ? (
                          fieldOptions.map((opt) => (
                            <SelectItem key={opt.name} value={opt.name}>
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

const HubspotSettings = () => {
  const { contactsFields, bindings, companiesFields } =
    useHubspotSettingsData();
  const [showConfirm, setShowConfirm] = useState(false);
  const { mutateAsync } = useUpdateHubspotBindings();
  const form = useForm<Record<string, string | null>>({
    defaultValues: {},
  });

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

      <AutoEnrichSelect />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <Tabs defaultValue="lead" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="lead">🙋‍♀️ Lead</TabsTrigger>
              <TabsTrigger value="account">🏢 Account</TabsTrigger>
            </TabsList>

            <TabsContent value="lead">
              {renderFields(
                form,
                leadSyncFields.info,
                "Info",
                contactsFields || {}
              )}
              {renderFields(
                form,
                leadSyncFields.status,
                "Status",
                contactsFields || {}
              )}
            </TabsContent>

            <TabsContent value="account">
              {renderFields(
                form,
                leadSyncFields.account,
                "Info",
                companiesFields || {}
              )}
              {renderFields(
                form,
                leadSyncFields.status,
                "Status",
                contactsFields || {}
              )}
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
