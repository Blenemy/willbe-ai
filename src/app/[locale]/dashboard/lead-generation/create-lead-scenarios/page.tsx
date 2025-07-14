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
import { useForm } from "react-hook-form";
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
import {
  leadScenariosFiltersSchema,
  LeadScenariosFormType,
} from "@/schemas/leadScenariosFiltersSchema";
import LeadsSaved from "./components/LeadsSaved/LeadsSaved";
import { useTranslations } from "next-intl";
import { RangeSelectPair } from "@/components/RangeSelectPair/RangePairSelect";
import FormSearchMultiSelect from "./components/formComponents/FormSearchMultiSelect";

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
  const t = useTranslations("leadProfileForm");

  const seniorityList = useMemo(() => {
    if (!data) return [];
    return data.seniorities.map((item: { value: string; title: string }) => ({
      value: item.value.toLowerCase().replace(/\s+/g, "-"),
      label: item.title,
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

  const {
    leadScenarioById,
    isFetchingLeadScenarioById,
    refetchLeadScenarioById,
  } = useLeadScenarios({
    enableFetch: false,
    scenarioId,
  });

  useEffect(() => {
    if (scenarioId) {
      refetchLeadScenarioById();
    }
  }, [scenarioId, refetchLeadScenarioById]);

  const form = useForm({
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
      personaSearch: "",
      persona: [],
      current_company: "",
      current_company_include: [],
      current_company_exclude: [],
      past_company: "",
      past_company_include: [],
      past_company_exclude: [],
      company_headcount_from: undefined as number | undefined,
      company_headcount_to: undefined as number | undefined,
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

  const watchedValues = form.watch();

  const isFormEmpty = useMemo(() => {
    const isEmpty = (val: unknown): boolean => {
      if (typeof val === "string") return val.trim() === "";
      if (Array.isArray(val)) return val.length === 0;
      if (typeof val === "boolean") return val === false;
      return false;
    };

    return Object.values(watchedValues).every(isEmpty);
  }, [watchedValues]);

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
          persona: [],
          current_company: "",
          current_company_include: [],
          current_company_exclude: [],
          past_company: "",
          past_company_include: [],
          past_company_exclude: [],
          company_headcount_from: undefined,
          company_headcount_to: undefined,
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

  const clearField = (from: string, to?: string) => {
    form.setValue(from as keyof LeadScenariosFormType, "", {
      shouldValidate: true,
    });
    if (to) form.trigger(to as keyof LeadScenariosFormType);
  };

  return (
    <div className="w-full px-6 py-10 flex flex-col">
      <h2 className="mb-5 font-semibold text-2xl">{t("title")}</h2>

      <CustomStepper
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        steps={[t("steps.0"), t("steps.1"), t("steps.2")]}
      />

      <ScenarioNameForm />

      {scenarioId && (
        <>
          {activeStep === 0 && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex gap-6">
                  <div className="flex flex-col gap-8 basis-1/2">
                    <div className="flex flex-col gap-4">
                      <div>{t("basicData")}</div>
                      <FormAccordion label={t("name")}>
                        <LeadFormInput
                          form={form}
                          name="first_name"
                          placeholder={t("firstName")}
                        />
                        <LeadFormInput
                          form={form}
                          name="last_name"
                          placeholder={t("lastName")}
                        />
                      </FormAccordion>

                      {languagesList?.length > 0 && (
                        <FormAccordion label={t("language")}>
                          <FormField
                            control={form.control}
                            name="language"
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <MultiSelect
                                    options={languagesList}
                                    onValueChange={field.onChange}
                                    defaultValue={field.value || []}
                                    placeholder={t("languagePlaceholder")}
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
                      <h4>{t("profileSection")}</h4>
                      <div className="flex flex-col gap-4">
                        <FormAccordion label={t("jobTitle.label")}>
                          <FormInputWithSearchMultiSelect
                            label={t("jobTitle.description")}
                            form={form}
                            searchName="job_title"
                            placeholder={t("jobTitle.placeholder")}
                            searchType="JOB_TITLE"
                            includeName="job_title_include"
                            excludeName="job_title_exclude"
                          />
                        </FormAccordion>

                        <FormAccordion label={t("pastJobTitle.label")}>
                          <FormInputWithSearchMultiSelect
                            label={t("pastJobTitle.description")}
                            form={form}
                            searchName="past_job_title"
                            placeholder={t("pastJobTitle.placeholder")}
                            searchType="JOB_TITLE"
                            includeName="past_job_title_include"
                            excludeName="past_job_title_exclude"
                          />
                        </FormAccordion>

                        <FormAccordion label={t("jobTenure.label")}>
                          <div className="flex gap-2 flex-col">
                            <h4>{t("jobTenure.description")}</h4>

                            <RangeSelectPair
                              fromName="headcount_from"
                              toName="headcount_to"
                              fromOptions={data?.tenuresAtJobTitle.from ?? []}
                              toOptions={data?.tenuresAtJobTitle.to ?? []}
                              placeholderFrom={t("jobTenure.from")}
                              placeholderTo={t("jobTenure.to")}
                              clearField={clearField}
                            />
                          </div>
                        </FormAccordion>

                        <FormAccordion label={t("department.label")}>
                          <FormInputWithSearchMultiSelect
                            label={t("department.description")}
                            form={form}
                            searchName="department"
                            placeholder={t("department.placeholder")}
                            searchType="DEPARTMENT"
                            includeName="department_include"
                            excludeName="department_exclude"
                          />
                        </FormAccordion>

                        <FormAccordion label={t("seniority.label")}>
                          <div className="flex flex-col gap-4">
                            <div className="flex gap-2 flex-col">
                              <h4>{t("seniority.include.description")}</h4>
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
                                          placeholder={t(
                                            "seniority.include.placeholder"
                                          )}
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
                              <h4>{t("seniority.exclude.description")}</h4>
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
                                          placeholder={t(
                                            "seniority.exclude.placeholder"
                                          )}
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
                              {t("experience.label")}
                            </AccordionTrigger>
                            <AccordionContent className="p-3">
                              <div className="flex gap-2 flex-col">
                                <h4>{t("experience.description")}</h4>

                                <RangeSelectPair
                                  fromName="experience_years_from"
                                  toName="experience_years_to"
                                  fromOptions={
                                    data?.totalYearsOfExpirience.from ?? []
                                  }
                                  toOptions={
                                    data?.totalYearsOfExpirience.to ?? []
                                  }
                                  placeholderFrom={t("experience.from")}
                                  placeholderTo={t("experience.to")}
                                  clearField={clearField}
                                />
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>

                        <FormAccordion label={t("pastCompany.label")}>
                          <FormInputWithSearchMultiSelect
                            label={t("pastCompany.description")}
                            form={form}
                            searchName="past_company"
                            placeholder={t("pastCompany.placeholder")}
                            searchType="COMPANY"
                            includeName="past_company_include"
                            excludeName="past_company_exclude"
                          />
                        </FormAccordion>

                        <FormAccordion label={t("currentCompany.label")}>
                          <FormInputWithSearchMultiSelect
                            label={t("currentCompany.description")}
                            form={form}
                            searchName="current_company"
                            placeholder={t("currentCompany.placeholder")}
                            searchType="COMPANY"
                            includeName="current_company_include"
                            excludeName="current_company_exclude"
                          />
                        </FormAccordion>

                        <FormAccordion label={t("companyLocation.label")}>
                          <FormInputWithSearchMultiSelect
                            label={t("companyLocation.description")}
                            form={form}
                            searchName="company_location"
                            placeholder={t("companyLocation.placeholder")}
                            searchType="LOCATION"
                            includeName="company_location_include"
                            excludeName="company_location_exclude"
                          />
                        </FormAccordion>

                        <FormAccordion label={t("industry.label")}>
                          <FormInputWithSearchMultiSelect
                            label={t("industry.description")}
                            form={form}
                            searchName="company_industry"
                            placeholder={t("industry.placeholder")}
                            searchType="INDUSTRY"
                            includeName="company_industry_include"
                            excludeName="company_industry_exclude"
                          />
                        </FormAccordion>

                        <Accordion type="single" collapsible>
                          <AccordionItem value="name" className="bg-slate-200">
                            <AccordionTrigger className="p-3">
                              {t("companyHeadcount.label")}
                            </AccordionTrigger>
                            <AccordionContent className="p-3">
                              <div className="flex gap-2 flex-col">
                                <h4>{t("companyHeadcount.description")}</h4>

                                <RangeSelectPair
                                  fromName="company_headcount_from"
                                  toName="company_headcount_to"
                                  fromOptions={
                                    data?.companyHeadcounts.from ?? []
                                  }
                                  toOptions={data?.companyHeadcounts.to ?? []}
                                  placeholderFrom={t("companyHeadcount.from")}
                                  placeholderTo={t("companyHeadcount.to")}
                                  clearField={clearField}
                                />
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>

                        <Accordion type="single" collapsible>
                          <AccordionItem value="name" className="bg-slate-200">
                            <AccordionTrigger className="p-3">
                              {t("companyTenure.label")}
                            </AccordionTrigger>
                            <AccordionContent className="p-3">
                              <div className="flex gap-2 flex-col">
                                <h4>{t("companyTenure.description")}</h4>

                                <RangeSelectPair
                                  fromName="company_tenure_from"
                                  toName="company_tenure_to"
                                  fromOptions={
                                    data?.tenuresAtCompany.from ?? []
                                  }
                                  toOptions={data?.tenuresAtCompany.to ?? []}
                                  placeholderFrom={t("companyTenure.from")}
                                  placeholderTo={t("companyTenure.to")}
                                  clearField={clearField}
                                />
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>

                        <Accordion type="single" collapsible>
                          <AccordionItem value="name" className="bg-slate-200">
                            <AccordionTrigger className="p-3">
                              {t("companyType.label")}
                            </AccordionTrigger>
                            <AccordionContent className="p-3">
                              <div className="flex gap-2 flex-col">
                                <h4>{t("companyType.description")}</h4>
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
                                            placeholder={t(
                                              "companyType.placeholder"
                                            )}
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
                        <h4>{t("linkedinActivity.title")}</h4>
                        <div className="flex flex-col gap-3">
                          <div className="flex justify-between items-center bg-slate-200 p-3">
                            <span>{t("linkedinActivity.posted")}</span>
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
                            <span>{t("linkedinActivity.mentioned")}</span>
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
                            <span>{t("linkedinActivity.viewedProfile")}</span>
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
                        <h4>{t("connections.title")}</h4>
                        <div className="flex flex-col gap-3">
                          <div className="flex justify-between items-center bg-slate-200 p-3">
                            <span>{t("connections.followingCompany")}</span>
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
                            <span>{t("connections.pastColleague")}</span>
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
                            <span>{t("connections.sharedExperiences")}</span>
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
                            <span>{t("connections.changedJobs")}</span>
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
                                {t("connections.networkDistance.label")}
                              </AccordionTrigger>
                              <AccordionContent className="p-3">
                                <div className="flex gap-2 flex-col">
                                  <h4>
                                    {t(
                                      "connections.networkDistance.description"
                                    )}
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
                                                <SelectValue
                                                  placeholder={t(
                                                    "connections.networkDistance.placeholder"
                                                  )}
                                                />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectGroup>
                                                  <SelectLabel>
                                                    {t(
                                                      "connections.networkDistance.selectLabel"
                                                    )}
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
                        <h4>{t("otherFilters.title")}</h4>
                        <div className="flex flex-col gap-3">
                          <Accordion type="single" collapsible>
                            <AccordionItem
                              value="keywords"
                              className="bg-slate-200"
                            >
                              <AccordionTrigger className="p-3">
                                {t("otherFilters.keywords.label")}
                              </AccordionTrigger>
                              <AccordionContent className="p-3">
                                <div className="flex gap-2 flex-col">
                                  <h4>
                                    {t("otherFilters.keywords.description")}
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
                                              placeholder={t(
                                                "otherFilters.keywords.placeholder"
                                              )}
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
                              value="persona"
                              className="bg-slate-200"
                            >
                              <AccordionTrigger className="p-3">
                                {t("otherFilters.persona.label")}
                              </AccordionTrigger>
                              <AccordionContent className="p-3">
                                <FormSearchMultiSelect
                                  form={form}
                                  label={t("otherFilters.persona.description")}
                                  searchName="personaSearch"
                                  selectName="persona"
                                  searchType="PERSONA"
                                  placeholder={t(
                                    "otherFilters.persona.placeholder"
                                  )}
                                />
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                          <FormAccordion
                            label={t("otherFilters.location.label")}
                          >
                            <FormInputWithSearchMultiSelect
                              label={t("otherFilters.location.description")}
                              form={form}
                              searchName="location"
                              placeholder={t(
                                "otherFilters.location.placeholder"
                              )}
                              searchType="LOCATION"
                              includeName="location_include"
                              excludeName="location_exclude"
                            />
                          </FormAccordion>
                          <FormAccordion label={t("otherFilters.school.label")}>
                            <FormInputWithSearchMultiSelect
                              label={t("otherFilters.school.description")}
                              form={form}
                              searchName="school"
                              placeholder={t("otherFilters.school.placeholder")}
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
                  isFormEmpty={isFormEmpty}
                />
              </form>
            </Form>
          )}

          {activeStep === 1 && !isFetchingLeadScenarioById && (
            <LeadTable
              setCurrentStep={setActiveStep}
              cursors={{
                previousPageCursor: leadScenarioById?.previousPageCursor,
                lastPageCursor: leadScenarioById?.lastPageCursor,
              }}
            />
          )}

          {activeStep === 2 && <LeadsSaved />}
        </>
      )}
    </div>
  );
};

export default CreateLeadScenarios;
