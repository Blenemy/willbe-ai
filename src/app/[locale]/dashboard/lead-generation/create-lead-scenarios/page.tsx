"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import { useEffect, useMemo, useState } from "react";
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
import LeadScenariousPresets from "./components/LeadScenariousPreset";
import CustomStepper from "@/components/Stepper/Stepper";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ScenarioNameForm from "./components/ScenarioNameForm";
import { useSearchParams } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useLeadFilters } from "@/hooks/useLeadFilters";
import { preparePayload } from "@/utils/prepareLeadFiltersPayload";
import { transformFilterValues } from "@/utils/transformFilterValues";
import { useLeadScenarios } from "@/hooks/useLeadScenarious";
import LeadFormInput from "./components/formComponents/LeadFormInput";
import FormAccordion from "./components/formComponents/FormAccordion";
import FormInputWithSearchMultiSelect from "./components/formComponents/FormInputWithSearchMultiSelect";
import {
  useDropdownOptionsQuery,
  useLanguagesQuery,
} from "@/hooks/useDropdownOptionsQuery";
import LeadTable from "./components/LeadTable/LeadTable";

const searchOptionSchema = z.object({
  title: z.string(),
  id: z.string(),
});

export const leadScenariosFiltersSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  language: z.array(z.string()),
  job_title: z.string(),
  job_title_include: z.array(searchOptionSchema),
  job_title_exclude: z.array(searchOptionSchema),
  job_tenure_from: z.string(),
  job_tenure_to: z.string(),
  past_job_title: z.string(),
  past_job_title_include: z.array(searchOptionSchema),
  past_job_title_exclude: z.array(searchOptionSchema),
  department: z.string(),
  department_include: z.array(searchOptionSchema),
  department_exclude: z.array(searchOptionSchema),
  seniority_include: z.array(z.string()),
  seniority_exclude: z.array(z.string()),
  experience_years_from: z.string(),
  experience_years_to: z.string(),
  school: z.string(),
  school_include: z.array(searchOptionSchema),
  school_exclude: z.array(searchOptionSchema),
  location: z.string(),
  location_include: z.array(searchOptionSchema),
  location_exclude: z.array(searchOptionSchema),
  posted_on_linkedin: z.boolean(),
  mentioned_in_news: z.boolean(),
  viewed_your_profile: z.boolean(),
  following_your_company: z.boolean(),
  past_colleague: z.boolean(),
  shared_experiences: z.boolean(),
  network_distance: z.string(),
  changed_jobs: z.boolean(),
  keywords: z.string(),
  persona: z.string(),
  current_company: z.string(),
  past_company: z.string(),
  past_company_include: z.array(searchOptionSchema),
  past_company_exclude: z.array(searchOptionSchema),
  company_headcount_from: z.string(),
  company_headcount_to: z.string(),
  company_industry: z.string(),
  company_industry_include: z.array(searchOptionSchema),
  company_industry_exclude: z.array(searchOptionSchema),
  company_location: z.string(),
  company_location_include: z.array(searchOptionSchema),
  company_location_exclude: z.array(searchOptionSchema),
  company_type: z.array(z.string()),
  company_tenure_from: z.string(),
  company_tenure_to: z.string(),
});

export type LeadScenariosFormType = z.infer<typeof leadScenariosFiltersSchema>;

const CreateLeadScenarios = () => {
  const [activeStep, setActiveStep] = useState(0);
  const searchParams = useSearchParams();
  const scenarioId = searchParams.get("scenarioId");
  const [newPreset, setNewPreset] = useState("");
  const [applyWithReset, setApplyWithReset] = useState(false);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(
    null
  );
  const { data } = useDropdownOptionsQuery();
  const { data: languages } = useLanguagesQuery();

  const seniorityList = useMemo(() => {
    if (!data) return [];
    return data.seniorities.map((item: string) => ({
      value: item.toLowerCase().replace(/\s+/g, "-"),
      label: item,
    }));
  }, [data]);

  const companyTypeList = useMemo(() => {
    if (!data) return [];

    return data.companyTypes.map((item: string) => ({
      value: item.toLowerCase().replace(/\s+/g, "-"),
      label: item,
    }));
  }, [data]);

  const languagesList = useMemo(() => {
    if (!languages) return [];

    return languages.map((item: string) => ({
      value: item.toLowerCase().replace(/\s+/g, "-"),
      label: item,
    }));
  }, [languages]);

  const handleLoadFilter = (id: string, applyWithReset: boolean) => {
    setSelectedScenarioId(id);
    setApplyWithReset(applyWithReset);
  };

  const { createLeadFilter, leadFilterById } = useLeadFilters({
    enableFetch: false,
    filterId: selectedScenarioId,
  });

  const { leadScenarioById } = useLeadScenarios({
    enableFetch: false,
    scenarioId,
  });

  const form: UseFormReturn<LeadScenariosFormType> =
    useForm<LeadScenariosFormType>({
      resolver: zodResolver(leadScenariosFiltersSchema),
      defaultValues: {
        first_name: "",
        last_name: "",
        language: [],
        job_title: "",
        job_title_include: [],
        job_title_exclude: [],
        job_tenure_from: "",
        job_tenure_to: "",
        past_job_title: "",
        past_job_title_include: [],
        past_job_title_exclude: [],
        department: "",
        department_include: [],
        department_exclude: [],
        seniority_include: [],
        seniority_exclude: [],
        experience_years_from: "",
        experience_years_to: "",
        school: "",
        school_include: [],
        school_exclude: [],
        location: "",
        location_include: [],
        location_exclude: [],
        posted_on_linkedin: false,
        mentioned_in_news: false,
        viewed_your_profile: false,
        following_your_company: false,
        past_colleague: false,
        shared_experiences: false,
        network_distance: "",
        changed_jobs: false,
        keywords: "",
        persona: "",
        current_company: "",
        past_company: "",
        past_company_include: [],
        past_company_exclude: [],
        company_headcount_from: "",
        company_headcount_to: "",
        company_industry: "",
        company_industry_include: [],
        company_industry_exclude: [],
        company_location: "",
        company_location_include: [],
        company_location_exclude: [],
        company_type: [],
        company_tenure_from: "",
        company_tenure_to: "",
      },
    });

  async function onSubmit(values: z.infer<typeof leadScenariosFiltersSchema>) {
    if (scenarioId) {
      const payload = preparePayload(values, scenarioId, newPreset);

      await createLeadFilter(payload);
      setNewPreset("");
    }
  }

  useEffect(() => {
    if (leadScenarioById) {
      if (leadScenarioById?.status !== "search") {
        setActiveStep(1);
      }
    }
  }, [leadScenarioById]);

  useEffect(() => {
    if (!leadFilterById && !leadScenarioById) return;

    let updatedValues = {};

    if (leadScenarioById?.filter) {
      updatedValues = transformFilterValues(
        leadScenarioById.filter.filterValues
      );
    }

    if (leadFilterById) {
      updatedValues = transformFilterValues(leadFilterById.filterValues);
    }

    if (Object.keys(updatedValues).length > 0) {
      if (applyWithReset) {
        form.reset({
          first_name: "",
          last_name: "",
          language: [],
          job_title: "",
          job_title_include: [],
          job_title_exclude: [],
          job_tenure_from: "",
          job_tenure_to: "",
          past_job_title: "",
          past_job_title_include: [],
          past_job_title_exclude: [],
          department: "",
          department_include: [],
          department_exclude: [],
          seniority_include: [],
          seniority_exclude: [],
          experience_years_from: "",
          experience_years_to: "",
          school: "",
          school_include: [],
          school_exclude: [],
          location: "",
          location_include: [],
          location_exclude: [],
          posted_on_linkedin: false,
          mentioned_in_news: false,
          viewed_your_profile: false,
          following_your_company: false,
          past_colleague: false,
          shared_experiences: false,
          network_distance: "",
          changed_jobs: false,
          keywords: "",
          persona: "",
          current_company: "",
          past_company: "",
          past_company_include: [],
          past_company_exclude: [],
          company_headcount_from: "",
          company_headcount_to: "",
          company_industry: "",
          company_industry_include: [],
          company_industry_exclude: [],
          company_location: "",
          company_location_include: [],
          company_location_exclude: [],
          company_type: [],
          company_tenure_from: "",
          company_tenure_to: "",
          ...updatedValues,
        });
      } else {
        Object.entries(updatedValues).forEach(([key, value]) => {
          //@ts-expect-error value is a type of unknown
          form.setValue(key as keyof typeof updatedValues, value, {
            shouldDirty: true,
          });
        });
      }

      form.trigger();
    }
  }, [leadScenarioById, leadFilterById, applyWithReset, form]);

  return (
    <div className="w-full px-6 py-10 flex flex-col">
      <h2 className="mb-5 font-semibold text-2xl">Create Lead Scenarios</h2>

      <CustomStepper activeStep={activeStep} setActiveStep={setActiveStep} />

      <ScenarioNameForm />

      {scenarioId && (
        <>
          {activeStep === 0 && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex gap-6">
                  <div className="flex flex-col gap-8 basis-1/2">
                    <div className="flex flex-col gap-4">
                      <div>🗃️ Basic data</div>
                      <FormAccordion label="🧑 Name">
                        <LeadFormInput
                          form={form}
                          name="first_name"
                          placeholder="First name"
                        />
                        <LeadFormInput
                          form={form}
                          name="last_name"
                          placeholder="Last name"
                        />
                      </FormAccordion>

                      {languagesList?.length > 0 && (
                        <FormAccordion label=" 💬 Language">
                          <FormField
                            control={form.control}
                            name="language"
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <MultiSelect
                                    options={languagesList}
                                    onValueChange={(value) =>
                                      field.onChange(value)
                                    }
                                    defaultValue={field.value || []}
                                    placeholder="Select profile languages"
                                    variant="secondary"
                                    className="bg-white hover:bg-white"
                                    animation={2}
                                    maxCount={3}
                                  />
                                </FormControl>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </FormAccordion>
                      )}
                    </div>

                    <div className="flex flex-col gap-4">
                      <h4 className="">👔 Professional profile</h4>
                      <div className="flex flex-col gap-4">
                        <FormAccordion label="🔨 Job title">
                          <FormInputWithSearchMultiSelect
                            label="Target individuals holding a specific position
                                  or role."
                            form={form}
                            searchName="job_title"
                            placeholder="Enter job title"
                            searchType="JOB_TITLE"
                            includeName="job_title_include"
                            excludeName="job_title_exclude"
                          />
                        </FormAccordion>

                        <FormAccordion label="🕰️ 🔨 Past job title">
                          <FormInputWithSearchMultiSelect
                            label="Search for individuals based on their previous
                                  work experience."
                            form={form}
                            searchName="past_job_title"
                            placeholder="Search by past job title..."
                            searchType="JOB_TITLE"
                            includeName="past_job_title_include"
                            excludeName="past_job_title_exclude"
                          />
                        </FormAccordion>

                        <FormAccordion label=" ⏳🔨 Tenure at job title">
                          <div className="flex gap-2 flex-col">
                            <h4>
                              Find people based on how long they&apos;ve been in
                              their current role.
                            </h4>
                            <div className="flex flex-col gap-3">
                              <FormField
                                control={form.control}
                                name="job_tenure_from"
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormControl>
                                      <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Tenure at Job Title (From)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectGroup>
                                            {data.tenuresAtJobTitle.from.map(
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
                                name="job_tenure_to"
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormControl>
                                      <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Tenure at Job Title (To)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectGroup>
                                            {data.tenuresAtJobTitle.to.map(
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

                        <FormAccordion label="💼 Department">
                          <FormInputWithSearchMultiSelect
                            label="Target individuals working in specific areas
                                  or divisions within a company."
                            form={form}
                            searchName="department"
                            placeholder="Search by job department..."
                            searchType="DEPARTMENT"
                            includeName="department_include"
                            excludeName="department_exclude"
                          />
                        </FormAccordion>

                        <FormAccordion label="🧓 Seniority">
                          <div className="flex flex-col gap-4">
                            <div className="flex gap-2 flex-col">
                              <h4>
                                Find people based on their level of
                                responsibility and experience within their
                                company to include.
                              </h4>
                              <div className="flex gap-2">
                                <FormField
                                  control={form.control}
                                  name="seniority_include"
                                  render={({ field }) => (
                                    <FormItem className="flex-1">
                                      <FormControl>
                                        <MultiSelect
                                          options={seniorityList}
                                          onValueChange={(value) =>
                                            field.onChange(value)
                                          }
                                          defaultValue={field.value || []}
                                          placeholder="Select seniorities to include"
                                          variant="secondary"
                                          className="bg-white hover:bg-white"
                                          animation={2}
                                          maxCount={3}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                            <div className="flex gap-2 flex-col">
                              <h4>
                                Find people based on their level of
                                responsibility and experience within their
                                company to exclude.
                              </h4>
                              <div className="flex gap-2">
                                <FormField
                                  control={form.control}
                                  name="seniority_exclude"
                                  render={({ field }) => (
                                    <FormItem className="flex-1">
                                      <FormControl>
                                        <MultiSelect
                                          options={seniorityList}
                                          onValueChange={(value) =>
                                            field.onChange(value)
                                          }
                                          defaultValue={field.value || []}
                                          placeholder="Select seniorities to exclude"
                                          variant="secondary"
                                          className="bg-white hover:bg-white"
                                          animation={2}
                                          maxCount={3}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                        </FormAccordion>

                        <Accordion type="single" collapsible>
                          <AccordionItem value="name" className="bg-slate-200">
                            <AccordionTrigger className="p-3">
                              ⏳ Total years of experience
                            </AccordionTrigger>
                            <AccordionContent className="p-3">
                              <div className="flex gap-2 flex-col">
                                <h4>
                                  Find individuals with a specific amount of
                                  overall professional experience.
                                </h4>
                                <div className="flex flex-col gap-3">
                                  <FormField
                                    control={form.control}
                                    name="experience_years_from"
                                    render={({ field }) => (
                                      <FormItem className="flex-1">
                                        <FormControl>
                                          <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                          >
                                            <SelectTrigger>
                                              <SelectValue placeholder="From (in years)" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectGroup>
                                                {data.totalYearsOfExpirience.from.map(
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
                                    name="experience_years_to"
                                    render={({ field }) => (
                                      <FormItem className="flex-1">
                                        <FormControl>
                                          <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                          >
                                            <SelectTrigger>
                                              <SelectValue placeholder="To (in years)" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectGroup>
                                                {data.totalYearsOfExpirience.to.map(
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
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>

                        <FormAccordion label="🕰️🏢 Past company">
                          <FormInputWithSearchMultiSelect
                            label="Target individuals who were previously
                                  employed at specific companies."
                            form={form}
                            searchName="past_company"
                            placeholder="Search by company name..."
                            searchType="COMPANY"
                            includeName="past_company_include"
                            excludeName="past_company_exclude"
                          />
                        </FormAccordion>

                        <FormAccordion label="🏢📍 Company location">
                          <FormInputWithSearchMultiSelect
                            label=" Target individuals working at companies
                                  located in specific geographical areas."
                            form={form}
                            searchName="company_location"
                            placeholder="Search by location"
                            searchType="LOCATION"
                            includeName="company_location_include"
                            excludeName="company_location_exclude"
                          />
                        </FormAccordion>

                        <FormAccordion label=" 🏭 Industry">
                          <FormInputWithSearchMultiSelect
                            label="Find individuals working in specific sectors
                                  or fields."
                            form={form}
                            searchName="company_industry"
                            placeholder="Search by industry..."
                            searchType="INDUSTRY"
                            includeName="company_industry_include"
                            excludeName="company_industry_exclude"
                          />
                        </FormAccordion>

                        <Accordion type="single" collapsible>
                          <AccordionItem value="name" className="bg-slate-200">
                            <AccordionTrigger className="p-3">
                              👥 Company headcount
                            </AccordionTrigger>
                            <AccordionContent className="p-3">
                              <div className="flex gap-2 flex-col">
                                <h4>
                                  Find individuals with a specific amount of
                                  overall professional experience.
                                </h4>
                                <div className="flex flex-col gap-3">
                                  <FormField
                                    control={form.control}
                                    name="company_headcount_from"
                                    render={({ field }) => (
                                      <FormItem className="flex-1">
                                        <FormControl>
                                          <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                          >
                                            <SelectTrigger>
                                              <SelectValue placeholder="From (in no. empoyees)" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectGroup>
                                                {data.companyHeadcounts.from.map(
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
                                    name="company_headcount_to"
                                    render={({ field }) => (
                                      <FormItem className="flex-1">
                                        <FormControl>
                                          <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                          >
                                            <SelectTrigger>
                                              <SelectValue placeholder="To (in no. empoyees))" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectGroup>
                                                {data.companyHeadcounts.to.map(
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
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>

                        <Accordion type="single" collapsible>
                          <AccordionItem value="name" className="bg-slate-200">
                            <AccordionTrigger className="p-3">
                              ⏳🏢 Tenure at company
                            </AccordionTrigger>
                            <AccordionContent className="p-3">
                              <div className="flex gap-2 flex-col">
                                <h4>
                                  Find people based on how long they&apos;ve
                                  been working at their current company.
                                </h4>
                                <div className="flex flex-col gap-3">
                                  <FormField
                                    control={form.control}
                                    name="company_tenure_from"
                                    render={({ field }) => (
                                      <FormItem className="flex-1">
                                        <FormControl>
                                          <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                          >
                                            <SelectTrigger>
                                              <SelectValue placeholder="From (in years)" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectGroup>
                                                {data.tenuresAtCompany.from.map(
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
                                    name="company_tenure_to"
                                    render={({ field }) => (
                                      <FormItem className="flex-1">
                                        <FormControl>
                                          <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                          >
                                            <SelectTrigger>
                                              <SelectValue placeholder="To (in years))" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectGroup>
                                                {data.tenuresAtCompany.to.map(
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
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>

                        <Accordion type="single" collapsible>
                          <AccordionItem value="name" className="bg-slate-200">
                            <AccordionTrigger className="p-3">
                              🏢🛠️ Company type
                            </AccordionTrigger>
                            <AccordionContent className="p-3">
                              <div className="flex gap-2 flex-col">
                                <h4>
                                  Find individuals working at specific types of
                                  companies (e.g., publicly traded, privately
                                  held, non-profit).
                                </h4>
                                <div className="flex gap-2">
                                  <FormField
                                    control={form.control}
                                    name="company_type"
                                    render={({ field }) => (
                                      <FormItem className="flex-1">
                                        <FormControl>
                                          <MultiSelect
                                            options={companyTypeList}
                                            onValueChange={(value) =>
                                              field.onChange(value)
                                            }
                                            defaultValue={field.value || []}
                                            placeholder="Select company types"
                                            variant="secondary"
                                            className="bg-white hover:bg-white"
                                            animation={2}
                                            maxCount={3}
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
                    <div>
                      <div className="flex flex-col gap-4">
                        <h4>📢 LinkedIn activity</h4>
                        <div className="flex flex-col gap-3">
                          <div className="flex justify-between items-center bg-slate-200 p-3">
                            <span>Posted on LinkedIn</span>
                            <FormField
                              control={form.control}
                              name="posted_on_linkedin"
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
                          <div className="flex justify-between items-center bg-slate-200 p-3">
                            <span>Mentioned in News</span>
                            <FormField
                              control={form.control}
                              name="mentioned_in_news"
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
                          <div className="flex justify-between items-center bg-slate-200 p-3">
                            <span>Viewed Your Profile Recently</span>
                            <FormField
                              control={form.control}
                              name="viewed_your_profile"
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
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex flex-col gap-4">
                        <h4>🕸️ Connections</h4>
                        <div className="flex flex-col gap-3">
                          <div className="flex justify-between items-center bg-slate-200 p-3">
                            <span>🔗 Following your company</span>
                            <FormField
                              control={form.control}
                              name="following_your_company"
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
                          <div className="flex justify-between items-center bg-slate-200 p-3">
                            <span>🕰️🙋‍♀️ Past colleague</span>
                            <FormField
                              control={form.control}
                              name="past_colleague"
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
                          <div className="flex justify-between items-center bg-slate-200 p-3">
                            <span>📷 Shared experiences</span>
                            <FormField
                              control={form.control}
                              name="shared_experiences"
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
                          <div className="flex justify-between items-center bg-slate-200 p-3">
                            <span>🔄💼 Changed jobs</span>
                            <FormField
                              control={form.control}
                              name="changed_jobs"
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
                                    including 1st, 2nd, and 3rd-degree
                                    connections.
                                  </h4>
                                  <div className="flex gap-2">
                                    <FormField
                                      control={form.control}
                                      name="network_distance"
                                      render={({ field }) => (
                                        <FormItem className="flex-1">
                                          <FormControl>
                                            <Select
                                              onValueChange={field.onChange}
                                              defaultValue={field.value}
                                            >
                                              <SelectTrigger>
                                                <SelectValue placeholder="Select a degree" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectGroup>
                                                  <SelectLabel>
                                                    Connection degree
                                                  </SelectLabel>
                                                  {data.networkDistances.map(
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
                      </div>
                    </div>

                    <div>
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
                                    Broaden your search using relevant terms
                                    that appear in profiles.
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
                          <Accordion type="single" collapsible>
                            <AccordionItem
                              value="keywords"
                              className="bg-slate-200"
                            >
                              <AccordionTrigger className="p-3">
                                👤 Persona
                              </AccordionTrigger>
                              <AccordionContent className="p-3">
                                <div className="flex gap-2 flex-col">
                                  <h4>
                                    Find the ideal prospects based on predefined
                                    buyer personas aligning with your target
                                    audience.
                                  </h4>
                                  <div className="flex gap-2">
                                    <FormField
                                      control={form.control}
                                      name="persona"
                                      render={({ field }) => (
                                        <FormItem className="flex-1">
                                          <FormControl>
                                            <Input
                                              className="mb-3"
                                              {...field}
                                              placeholder="Search by persona"
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
                          <FormAccordion label="📍 Location">
                            <FormInputWithSearchMultiSelect
                              label="Find individuals based on their current
                              geographical location."
                              form={form}
                              searchName="location"
                              placeholder="Search by location..."
                              searchType="LOCATION"
                              includeName="location_include"
                              excludeName="location_exclude"
                            />
                          </FormAccordion>
                          <FormAccordion label="🏫 School">
                            <FormInputWithSearchMultiSelect
                              label="Search for individuals based on their educational
                              background and institutions attended."
                              form={form}
                              searchName="school"
                              placeholder="Search by school..."
                              searchType="LOCATION"
                              includeName="school_include"
                              excludeName="school_exclude"
                            />
                          </FormAccordion>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <LeadScenariousPresets
                  setNewPreset={setNewPreset}
                  newPreset={newPreset}
                  handleLoadFilter={handleLoadFilter}
                  setActiveStep={setActiveStep}
                  leadScenarioById={leadScenarioById}
                />
              </form>
            </Form>
          )}

          {activeStep === 1 && <LeadTable />}
        </>
      )}
    </div>
  );
};

export default CreateLeadScenarios;
