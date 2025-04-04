"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CustomStepper from "@/components/Stepper/Stepper";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useAccountScenariosDropdowns } from "@/hooks/useDropdownOptionsQuery";
import FormAccordion from "../../lead-generation/create-lead-scenarios/components/formComponents/FormAccordion";
import AccountNameForm from "./components/AccountNameForm";
import { accountScenarioFormSchema } from "@/schemas/accountScenarioFormSchema";
import MultiSelectWithSearchButton from "./components/formComponents/MultiSelectWithSearchButton";
import { Button } from "@/components/ui/button";
import { prepareAccountPayload } from "@/utils/prepareAccountPayload";
import { useAccountScenarios } from "@/hooks/useAccountScenarios";
import { transformFilterValues } from "@/utils/transformFilterValues";
import AccountTable from "./components/AccountTable/AccountTable";
import AccountSave from "./components/AccountSave/AccountSave";
import { XIcon } from "lucide-react";

export type AccountScenariosType = z.infer<typeof accountScenarioFormSchema>;

const CreateAccountScenarios = () => {
  const [activeStep, setActiveStep] = useState(0);
  const searchParams = useSearchParams();
  const accountId = searchParams.get("accountId");
  const accountName = searchParams.get("accountName");
  const { updateAccountScenario, accountScenarioById } = useAccountScenarios({
    enableFetch: false,
    accountId,
  });

  const { data: dropdowns } = useAccountScenariosDropdowns();

  const form: UseFormReturn<AccountScenariosType> =
    useForm<AccountScenariosType>({
      resolver: zodResolver(accountScenarioFormSchema),
      defaultValues: {
        industry: "",
        industry_include: [],
        industry_exclude: [],

        location: "",
        location_include: [],
        location_exclude: [],

        headcount_from: "",
        headcount_to: "",

        headcount_growth_from: "",
        headcount_growth_to: "",

        fortune_from: "",
        fortune_to: "",

        followers_count_from: "",
        followers_count_to: "",

        recent_activities: "",

        has_job_offers: false,

        technology_search_input: "",
        technology: [],
        // technology_include: [],
        // technology_exclude: [],

        network_distance: "",

        keywords: "",

        department_headcount_growth_from: "",
        department_headcount_growth_to: "",

        department_headcount_from: "",
        department_headcount_to: "",

        saved_accounts: "",
        saved_accounts_include: [],
        saved_accounts_exclude: [],

        annual_revenue_from: "",
        annual_revenue_to: "",

        annual_revenue_currency: "",
      },
    });

  async function onSubmit(values: z.infer<typeof accountScenarioFormSchema>) {
    if (accountId && accountName) {
      const payload = prepareAccountPayload(values, accountName);

      updateAccountScenario({ accountId, payload });
    }
  }

  const handleClearAll = () => {
    form.reset({
      industry: "",
      industry_include: [],
      industry_exclude: [],

      location: "",
      location_include: [],
      location_exclude: [],

      headcount_from: "",
      headcount_to: "",

      headcount_growth_from: "",
      headcount_growth_to: "",

      fortune_from: "",
      fortune_to: "",

      followers_count_from: "",
      followers_count_to: "",

      recent_activities: "",

      has_job_offers: false,

      technology_search_input: "",
      technology: [],
      // technology_include: [],
      // technology_exclude: [],

      network_distance: "",

      keywords: "",

      department_headcount_growth_from: "",
      department_headcount_growth_to: "",

      department_headcount_from: "",
      department_headcount_to: "",

      saved_accounts: "",
      saved_accounts_include: [],
      saved_accounts_exclude: [],

      annual_revenue_from: "",
      annual_revenue_to: "",

      annual_revenue_currency: "",
    });

    form.trigger();
  };

  useEffect(() => {
    if (!accountScenarioById) return;

    const updatedValues = transformFilterValues(
      accountScenarioById.filterValues
    );

    Object.entries(updatedValues).forEach(([key, value]) => {
      //@ts-expect-error value is a type of unknown
      form.setValue(key as keyof typeof updatedValues, value, {
        shouldDirty: true,
      });
    });

    form.trigger();
  }, [accountScenarioById, form]);

  return (
    <div className="w-full px-6 py-10 flex flex-col">
      <h2 className="mb-5 font-semibold text-2xl">Create Account Scenarios</h2>

      <CustomStepper
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        steps={["Account search", "Account select", "Account save"]}
        disabled={!accountId}
      />

      <AccountNameForm />

      {accountId && (
        <>
          {activeStep === 0 && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <div className="flex gap-6">
                  <div className="flex flex-col gap-8 basis-1/2">
                    <div className="flex flex-col gap-4">
                      <h4 className="">🗃️ Basic data</h4>
                      <div className="flex flex-col gap-4">
                        <FormAccordion label="🏭 Industry">
                          <MultiSelectWithSearchButton
                            label="Find companies operating in specific sectors or fields"
                            form={form}
                            searchName="industry"
                            placeholder="Search by industry"
                            searchType="INDUSTRY"
                            includeName="industry_include"
                            excludeName="industry_exclude"
                          />
                        </FormAccordion>

                        <FormAccordion label="📍 Location">
                          <MultiSelectWithSearchButton
                            label="Find companies based on their geographical location"
                            form={form}
                            searchName="location"
                            placeholder="Search by location"
                            searchType="LOCATION"
                            includeName="location_include"
                            excludeName="location_exclude"
                          />
                        </FormAccordion>

                        <FormAccordion label="👥 Headcount">
                          <div className="flex gap-2 flex-col">
                            <h4>
                              Find companies based on the number of employees
                              they have.
                            </h4>
                            <div className="flex flex-col gap-3">
                              <FormField
                                control={form.control}
                                name="headcount_from"
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormControl>
                                      <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                      >
                                        <SelectTrigger className="flex h-10 w-full items-center justify-between gap-2 px-3">
                                          <div className="flex items-center flex-1 overflow-hidden">
                                            <SelectValue
                                              placeholder="From (in no. employees)"
                                              className="truncate"
                                            />
                                          </div>

                                          {field.value && (
                                            <XIcon
                                              className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-destructive"
                                              onPointerDown={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                form.setValue(
                                                  "headcount_from",
                                                  ""
                                                );
                                              }}
                                            />
                                          )}
                                        </SelectTrigger>

                                        <SelectContent>
                                          <SelectGroup>
                                            {dropdowns?.headcounts.from.map(
                                              (value: string) => (
                                                <SelectItem
                                                  value={value}
                                                  key={value}
                                                >
                                                  {value}
                                                </SelectItem>
                                              )
                                            )}
                                          </SelectGroup>
                                        </SelectContent>
                                      </Select>
                                    </FormControl>

                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="headcount_to"
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormControl>
                                      <Select
                                        key={field.value}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                      >
                                        <SelectTrigger className="flex h-10 w-full items-center justify-between gap-2 px-3">
                                          <div className="flex items-center flex-1 overflow-hidden">
                                            <SelectValue
                                              placeholder="To (in no. employees)"
                                              className="truncate"
                                            />
                                          </div>

                                          {field.value && (
                                            <XIcon
                                              className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-destructive"
                                              onPointerDown={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                form.setValue(
                                                  "headcount_to",
                                                  ""
                                                );
                                              }}
                                            />
                                          )}
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectGroup>
                                            {dropdowns?.headcounts.to.map(
                                              (value: string) => (
                                                <SelectItem
                                                  value={value}
                                                  key={value}
                                                >
                                                  {value}
                                                </SelectItem>
                                              )
                                            )}
                                          </SelectGroup>
                                        </SelectContent>
                                      </Select>
                                    </FormControl>

                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </FormAccordion>

                        <FormAccordion label="👥📈 Headcount growth">
                          <div className="flex gap-2 flex-col">
                            <h4>
                              Find companies that are actively expanding their
                              workforce.
                            </h4>
                            <div className="flex flex-col gap-3">
                              <FormField
                                control={form.control}
                                name="headcount_growth_from"
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormControl>
                                      <Select
                                        key={field.value}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                      >
                                        <SelectTrigger className="flex h-10 w-full items-center justify-between gap-2 px-3">
                                          <div className="flex items-center flex-1 overflow-hidden">
                                            <SelectValue
                                              placeholder="From (in no. employees)"
                                              className="truncate"
                                            />
                                          </div>

                                          {field.value && (
                                            <XIcon
                                              className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-destructive"
                                              onPointerDown={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                form.setValue(
                                                  "headcount_growth_from",
                                                  ""
                                                );
                                              }}
                                            />
                                          )}
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectGroup>
                                            {dropdowns?.headcounts.from.map(
                                              (value: string) => (
                                                <SelectItem
                                                  value={value}
                                                  key={value}
                                                >
                                                  {value}
                                                </SelectItem>
                                              )
                                            )}
                                          </SelectGroup>
                                        </SelectContent>
                                      </Select>
                                    </FormControl>

                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="headcount_growth_to"
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormControl>
                                      <Select
                                        key={field.value}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                      >
                                        <SelectTrigger className="flex h-10 w-full items-center justify-between gap-2 px-3">
                                          <div className="flex items-center flex-1 overflow-hidden">
                                            <SelectValue
                                              placeholder="To (in no. employees)"
                                              className="truncate"
                                            />
                                          </div>

                                          {field.value && (
                                            <XIcon
                                              className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-destructive"
                                              onPointerDown={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                form.setValue(
                                                  "headcount_growth_to",
                                                  ""
                                                );
                                              }}
                                            />
                                          )}
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectGroup>
                                            {dropdowns?.headcounts.to.map(
                                              (value: string) => (
                                                <SelectItem
                                                  value={value}
                                                  key={value}
                                                >
                                                  {value}
                                                </SelectItem>
                                              )
                                            )}
                                          </SelectGroup>
                                        </SelectContent>
                                      </Select>
                                    </FormControl>

                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </FormAccordion>

                        <FormAccordion label="💰 Fortune 500 List">
                          <div className="flex gap-2 flex-col">
                            <h4>
                              Find companies recognized on the prestigious
                              Fortune 500 list.
                            </h4>
                            <div className="flex flex-col gap-3">
                              <FormField
                                control={form.control}
                                name="fortune_from"
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormControl>
                                      <Select
                                        key={field.value}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                      >
                                        <SelectTrigger className="flex h-10 w-full items-center justify-between gap-2 px-3">
                                          <div className="flex items-center flex-1 overflow-hidden">
                                            <SelectValue
                                              placeholder="From (in no. employees)"
                                              className="truncate"
                                            />
                                          </div>

                                          {field.value && (
                                            <XIcon
                                              className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-destructive"
                                              onPointerDown={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                form.setValue(
                                                  "fortune_from",
                                                  ""
                                                );
                                              }}
                                            />
                                          )}
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectGroup>
                                            {dropdowns?.fortunes.from.map(
                                              (value: string) => (
                                                <SelectItem
                                                  value={value}
                                                  key={value}
                                                >
                                                  {value}
                                                </SelectItem>
                                              )
                                            )}
                                          </SelectGroup>
                                        </SelectContent>
                                      </Select>
                                    </FormControl>

                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="fortune_to"
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormControl>
                                      <Select
                                        key={field.value}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                      >
                                        <SelectTrigger className="flex h-10 w-full items-center justify-between gap-2 px-3">
                                          <div className="flex items-center flex-1 overflow-hidden">
                                            <SelectValue
                                              placeholder="To (in no. employees)"
                                              className="truncate"
                                            />
                                          </div>

                                          {field.value && (
                                            <XIcon
                                              className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-destructive"
                                              onPointerDown={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                form.setValue("fortune_to", "");
                                              }}
                                            />
                                          )}
                                        </SelectTrigger>

                                        <SelectContent>
                                          <SelectGroup>
                                            {dropdowns?.fortunes.to.map(
                                              (value: string) => (
                                                <SelectItem
                                                  value={value}
                                                  key={value}
                                                >
                                                  {value}
                                                </SelectItem>
                                              )
                                            )}
                                          </SelectGroup>
                                        </SelectContent>
                                      </Select>
                                    </FormControl>

                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </FormAccordion>

                        <FormAccordion label="🙋‍♀️ Followers count">
                          <div className="flex gap-2 flex-col">
                            <h4>
                              Filter companies based on the number of followers
                              they have on the platform.
                            </h4>
                            <div className="flex flex-col gap-3">
                              <FormField
                                control={form.control}
                                name="followers_count_from"
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormControl>
                                      <Select
                                        key={field.value}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                      >
                                        <SelectTrigger className="flex h-10 w-full items-center justify-between gap-2 px-3">
                                          <div className="flex items-center flex-1 overflow-hidden">
                                            <SelectValue
                                              placeholder="From (in no. employees)"
                                              className="truncate"
                                            />
                                          </div>

                                          {field.value && (
                                            <XIcon
                                              className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-destructive"
                                              onPointerDown={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                form.setValue(
                                                  "followers_count_from",
                                                  ""
                                                );
                                              }}
                                            />
                                          )}
                                        </SelectTrigger>

                                        <SelectContent>
                                          <SelectGroup>
                                            {dropdowns?.followersCounts.from.map(
                                              (value: string) => (
                                                <SelectItem
                                                  value={value}
                                                  key={value}
                                                >
                                                  {value}
                                                </SelectItem>
                                              )
                                            )}
                                          </SelectGroup>
                                        </SelectContent>
                                      </Select>
                                    </FormControl>

                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="followers_count_to"
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormControl>
                                      <Select
                                        key={field.value}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                      >
                                        <SelectTrigger className="flex h-10 w-full items-center justify-between gap-2 px-3">
                                          <div className="flex items-center flex-1 overflow-hidden">
                                            <SelectValue
                                              placeholder="To (in no. employees)"
                                              className="truncate"
                                            />
                                          </div>

                                          {field.value && (
                                            <XIcon
                                              className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-destructive"
                                              onPointerDown={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                form.setValue(
                                                  "followers_count_to",
                                                  ""
                                                );
                                              }}
                                            />
                                          )}
                                        </SelectTrigger>

                                        <SelectContent>
                                          <SelectGroup>
                                            {dropdowns?.followersCounts.to.map(
                                              (value: string) => (
                                                <SelectItem
                                                  value={value}
                                                  key={value}
                                                >
                                                  {value}
                                                </SelectItem>
                                              )
                                            )}
                                          </SelectGroup>
                                        </SelectContent>
                                      </Select>
                                    </FormControl>

                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </FormAccordion>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <h4 className="">🎯 Activity & focus</h4>
                      <div className="flex flex-col gap-4">
                        <FormAccordion label="📣 Recent activities">
                          <FormField
                            control={form.control}
                            name="recent_activities"
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <Select
                                    key={field.value}
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <SelectTrigger className="flex h-10 w-full items-center justify-between gap-2 px-3">
                                      <div className="flex items-center flex-1 overflow-hidden">
                                        <SelectValue
                                          placeholder="Select an activity"
                                          className="truncate"
                                        />
                                      </div>

                                      {field.value && (
                                        <XIcon
                                          className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-destructive"
                                          onPointerDown={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            form.setValue(
                                              "recent_activities",
                                              ""
                                            );
                                          }}
                                        />
                                      )}
                                    </SelectTrigger>

                                    <SelectContent>
                                      <SelectGroup>
                                        <SelectLabel>
                                          Connection degree
                                        </SelectLabel>
                                        {dropdowns?.recentActivities.map(
                                          ({
                                            value,
                                            title,
                                          }: {
                                            value: string;
                                            title: string;
                                          }) => (
                                            <SelectItem
                                              value={value}
                                              key={value}
                                            >
                                              {title}
                                            </SelectItem>
                                          )
                                        )}
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </FormAccordion>

                        <div className="flex justify-between items-center bg-slate-200 p-3">
                          <span>💼 Has job offers</span>
                          <FormField
                            control={form.control}
                            name="has_job_offers"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormAccordion label="💻 Technology">
                          <MultiSelectWithSearchButton
                            label="Find companies using specific technologies or software solutions."
                            form={form}
                            searchName="technology_search_input"
                            valueName="technology"
                            placeholder="Search by technology"
                            searchType="TECHNOLOGIES"
                            isSingleSelect
                          />
                        </FormAccordion>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <h4 className="">🕸️ Connections & reach</h4>
                      <Accordion type="single" collapsible>
                        <AccordionItem
                          value="network-distance"
                          className="bg-slate-200"
                        >
                          <AccordionTrigger className="p-3">
                            🌍 Network distance
                          </AccordionTrigger>
                          <AccordionContent className="p-3">
                            <div className="flex gap-2 flex-col">
                              <h4>
                                Find people within your extended network,
                                including 1st, 2nd, and 3rd-degree connections.
                              </h4>
                              <div className="flex gap-2">
                                <FormField
                                  control={form.control}
                                  name="network_distance"
                                  render={({ field }) => (
                                    <FormItem className="flex-1">
                                      <FormControl>
                                        <Select
                                          key={field.value}
                                          onValueChange={field.onChange}
                                          defaultValue={field.value}
                                        >
                                          <SelectTrigger className="flex h-10 w-full items-center justify-between gap-2 px-3">
                                            <div className="flex items-center flex-1 overflow-hidden">
                                              <SelectValue
                                                placeholder="Select a degree"
                                                className="truncate"
                                              />
                                            </div>

                                            {field.value && (
                                              <XIcon
                                                className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-destructive"
                                                onPointerDown={(e) => {
                                                  e.preventDefault();
                                                  e.stopPropagation();
                                                  form.setValue(
                                                    "network_distance",
                                                    ""
                                                  );
                                                }}
                                              />
                                            )}
                                          </SelectTrigger>

                                          <SelectContent>
                                            <SelectGroup>
                                              <SelectLabel>
                                                Connection degree
                                              </SelectLabel>
                                              {dropdowns?.networkDistances.map(
                                                ({
                                                  value,
                                                  title,
                                                }: {
                                                  value: string;
                                                  title: string;
                                                }) => (
                                                  <SelectItem
                                                    value={value}
                                                    key={value}
                                                  >
                                                    {title}
                                                  </SelectItem>
                                                )
                                              )}
                                            </SelectGroup>
                                          </SelectContent>
                                        </Select>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>

                    <div className="flex flex-col gap-4">
                      <h4>🎛️ Other filters</h4>
                      <div className="flex flex-col gap-3">
                        <Accordion type="single" collapsible>
                          <AccordionItem
                            value="keywords"
                            className="bg-slate-200"
                          >
                            <AccordionTrigger className="p-3">
                              🏷️ Keywords
                            </AccordionTrigger>
                            <AccordionContent className="p-3">
                              <div className="flex gap-2 flex-col">
                                <h4>
                                  Broaden your search using relevant terms that
                                  appear in profiles.
                                </h4>
                                <div className="flex gap-2">
                                  <FormField
                                    control={form.control}
                                    name="keywords"
                                    render={({ field }) => (
                                      <FormItem className="flex-1">
                                        <FormControl>
                                          <Input
                                            className="mb-3"
                                            {...field}
                                            placeholder="Include keywords"
                                          />
                                        </FormControl>

                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-8 basis-1/2">
                    <div className="flex flex-col gap-4">
                      <h4 className="">💼 Specific department filters</h4>
                      <div className="flex flex-col gap-4">
                        <FormAccordion label="💼👥 Department headcount">
                          <div className="flex gap-2 flex-col">
                            <h4>
                              Find companies based on the number of employees
                              within specific departments.
                            </h4>
                            <div className="flex flex-col gap-3">
                              <FormField
                                control={form.control}
                                name="department_headcount_from"
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormControl>
                                      <Select
                                        key={field.value}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                      >
                                        <SelectTrigger className="flex h-10 w-full items-center justify-between gap-2 px-3">
                                          <div className="flex items-center flex-1 overflow-hidden">
                                            <SelectValue
                                              placeholder="From (in no. employees)"
                                              className="truncate"
                                            />
                                          </div>

                                          {field.value && (
                                            <XIcon
                                              className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-destructive"
                                              onPointerDown={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                form.setValue(
                                                  "department_headcount_from",
                                                  ""
                                                );
                                              }}
                                            />
                                          )}
                                        </SelectTrigger>

                                        <SelectContent>
                                          <SelectGroup>
                                            {dropdowns?.headcounts.from.map(
                                              (value: string) => (
                                                <SelectItem
                                                  value={value}
                                                  key={value}
                                                >
                                                  {value}
                                                </SelectItem>
                                              )
                                            )}
                                          </SelectGroup>
                                        </SelectContent>
                                      </Select>
                                    </FormControl>

                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="department_headcount_to"
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormControl>
                                      <Select
                                        key={field.value}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                      >
                                        <SelectTrigger className="flex h-10 w-full items-center justify-between gap-2 px-3">
                                          <div className="flex items-center flex-1 overflow-hidden">
                                            <SelectValue
                                              placeholder="To (in no. employees)"
                                              className="truncate"
                                            />
                                          </div>

                                          {field.value && (
                                            <XIcon
                                              className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-destructive"
                                              onPointerDown={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                form.setValue(
                                                  "department_headcount_to",
                                                  ""
                                                );
                                              }}
                                            />
                                          )}
                                        </SelectTrigger>

                                        <SelectContent>
                                          <SelectGroup>
                                            {dropdowns?.headcounts.to.map(
                                              (value: string) => (
                                                <SelectItem
                                                  value={value}
                                                  key={value}
                                                >
                                                  {value}
                                                </SelectItem>
                                              )
                                            )}
                                          </SelectGroup>
                                        </SelectContent>
                                      </Select>
                                    </FormControl>

                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </FormAccordion>

                        <FormAccordion label="💼👥📈 Department headcount growth">
                          <div className="flex gap-2 flex-col">
                            <h4>
                              Find companies actively expanding specific
                              departments within their workforce.
                            </h4>
                            <div className="flex flex-col gap-3">
                              <FormField
                                control={form.control}
                                name="department_headcount_growth_from"
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormControl>
                                      <Select
                                        key={field.value}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                      >
                                        <SelectTrigger className="flex h-10 w-full items-center justify-between gap-2 px-3">
                                          <div className="flex items-center flex-1 overflow-hidden">
                                            <SelectValue
                                              placeholder="From (in %)"
                                              className="truncate"
                                            />
                                          </div>

                                          {field.value && (
                                            <XIcon
                                              className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-destructive"
                                              onPointerDown={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                form.setValue(
                                                  "department_headcount_growth_from",
                                                  ""
                                                );
                                              }}
                                            />
                                          )}
                                        </SelectTrigger>

                                        <SelectContent>
                                          <SelectGroup>
                                            {dropdowns?.headcounts.from.map(
                                              (value: string) => (
                                                <SelectItem
                                                  value={value}
                                                  key={value}
                                                >
                                                  {value}
                                                </SelectItem>
                                              )
                                            )}
                                          </SelectGroup>
                                        </SelectContent>
                                      </Select>
                                    </FormControl>

                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="department_headcount_growth_to"
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormControl>
                                      <Select
                                        key={field.value}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                      >
                                        <SelectTrigger className="flex h-10 w-full items-center justify-between gap-2 px-3">
                                          <div className="flex items-center flex-1 overflow-hidden">
                                            <SelectValue
                                              placeholder="to (in %)"
                                              className="truncate"
                                            />
                                          </div>

                                          {field.value && (
                                            <XIcon
                                              className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-destructive"
                                              onPointerDown={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                form.setValue(
                                                  "department_headcount_growth_to",
                                                  ""
                                                );
                                              }}
                                            />
                                          )}
                                        </SelectTrigger>

                                        <SelectContent>
                                          <SelectGroup>
                                            {dropdowns?.headcounts.to.map(
                                              (value: string) => (
                                                <SelectItem
                                                  value={value}
                                                  key={value}
                                                >
                                                  {value}
                                                </SelectItem>
                                              )
                                            )}
                                          </SelectGroup>
                                        </SelectContent>
                                      </Select>
                                    </FormControl>

                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </FormAccordion>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <h4 className="">📋 Account lists saved on LinkedIn</h4>
                      <div className="flex flex-col gap-4">
                        <FormAccordion label="📋 Accounts">
                          <MultiSelectWithSearchButton
                            label="Find companies operating in specific sectors or fields"
                            form={form}
                            searchName="saved_accounts"
                            placeholder="Search by list name"
                            searchType="SAVED_ACCOUNTS"
                            includeName="saved_accounts_include"
                            excludeName="saved_accounts_exclude"
                          />
                        </FormAccordion>
                      </div>
                    </div>

                    <FormAccordion label="🗓️💶 Annual revenue">
                      <div className="flex gap-2 flex-col">
                        <h4>
                          Filter companies based on their estimated or reported
                          annual revenue.
                        </h4>
                        <div className="flex flex-col gap-3">
                          <FormField
                            control={form.control}
                            name="annual_revenue_from"
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <Select
                                    key={field.value}
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <SelectTrigger className="flex h-10 w-full items-center justify-between gap-2 px-3">
                                      <div className="flex items-center flex-1 overflow-hidden">
                                        <SelectValue
                                          placeholder="From (in %)"
                                          className="truncate"
                                        />
                                      </div>

                                      {field.value && (
                                        <XIcon
                                          className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-destructive"
                                          onPointerDown={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            form.setValue(
                                              "annual_revenue_from",
                                              ""
                                            );
                                          }}
                                        />
                                      )}
                                    </SelectTrigger>

                                    <SelectContent>
                                      <SelectGroup>
                                        {dropdowns?.annualRevenues.from.map(
                                          (value: string) => (
                                            <SelectItem
                                              value={value}
                                              key={value}
                                            >
                                              {value}
                                            </SelectItem>
                                          )
                                        )}
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>
                                </FormControl>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="annual_revenue_to"
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <Select
                                    key={field.value}
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <SelectTrigger className="flex h-10 w-full items-center justify-between gap-2 px-3">
                                      <div className="flex items-center flex-1 overflow-hidden">
                                        <SelectValue
                                          placeholder="to (in %)"
                                          className="truncate"
                                        />
                                      </div>

                                      {field.value && (
                                        <XIcon
                                          className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-destructive"
                                          onPointerDown={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            form.setValue(
                                              "annual_revenue_to",
                                              ""
                                            );
                                          }}
                                        />
                                      )}
                                    </SelectTrigger>

                                    <SelectContent>
                                      <SelectGroup>
                                        {dropdowns?.annualRevenues.to.map(
                                          (value: string) => (
                                            <SelectItem
                                              value={value}
                                              key={value}
                                            >
                                              {value}
                                            </SelectItem>
                                          )
                                        )}
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>
                                </FormControl>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="flex flex-col gap-3">
                            <FormField
                              control={form.control}
                              name="annual_revenue_currency"
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormControl>
                                    <Select
                                      key={field.value}
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                    >
                                      <SelectTrigger className="flex h-10 w-full items-center justify-between gap-2 px-3">
                                        <div className="flex items-center flex-1 overflow-hidden">
                                          <SelectValue
                                            placeholder="Select currency"
                                            className="truncate"
                                          />
                                        </div>

                                        {field.value && (
                                          <XIcon
                                            className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-destructive"
                                            onPointerDown={(e) => {
                                              e.preventDefault();
                                              e.stopPropagation();
                                              form.setValue(
                                                "annual_revenue_currency",
                                                ""
                                              );
                                            }}
                                          />
                                        )}
                                      </SelectTrigger>

                                      <SelectContent>
                                        <SelectGroup>
                                          {dropdowns?.annualRevenues.currencies.map(
                                            (value: string) => (
                                              <SelectItem
                                                value={value}
                                                key={value}
                                              >
                                                {value}
                                              </SelectItem>
                                            )
                                          )}
                                        </SelectGroup>
                                      </SelectContent>
                                    </Select>
                                  </FormControl>

                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </FormAccordion>
                  </div>
                </div>

                <div className="flex gap-4 items-center justify-center">
                  <Button type="submit">Save scenario</Button>
                  <Button
                    type="button"
                    onClick={() => setActiveStep((prev) => prev + 1)}
                  >
                    Search account
                  </Button>
                  <Button type="button" onClick={handleClearAll}>
                    Clear all
                  </Button>
                </div>
              </form>
            </Form>
          )}

          {activeStep === 1 && <AccountTable setCurrentStep={setActiveStep} />}
          {activeStep === 2 && <AccountSave />}
        </>
      )}
    </div>
  );
};

export default CreateAccountScenarios;
