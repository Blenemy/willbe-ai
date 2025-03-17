"use client";

import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import { useEffect, useState } from "react";
import {
  Briefcase,
  Crown,
  User,
  Users,
  Building,
  Handshake,
  Landmark,
} from "lucide-react";
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

const seniorityList = [
  { value: "owner", label: "Owner / Partner", icon: Crown },
  { value: "cxo", label: "CXO", icon: Briefcase },
  { value: "vp", label: "Vice President", icon: Users },
  { value: "director", label: "Director", icon: Building },
  { value: "experienced-manager", label: "Experienced Manager", icon: User },
  { value: "entry-manager", label: "Entry Level Manager", icon: User },
  { value: "strategic", label: "Strategic", icon: Briefcase },
  { value: "senior", label: "Senior", icon: Users },
  { value: "entry", label: "Entry Level", icon: User },
  { value: "training", label: "In Training", icon: User },
];

const companyTypeList = [
  { value: "Public company", label: "Public company", icon: Crown },
  { value: "Privately held", label: "Privately held", icon: Briefcase },
  { value: "Non profit", label: "Non profit", icon: Users },
  {
    value: "Educational institution",
    label: "Educational institution",
    icon: Building,
  },
  { value: "Partnership", label: "Partnership", icon: Handshake },
  { value: "Self employed", label: "Self employed", icon: User },
  { value: "Self owned", label: "Self owned", icon: Briefcase },
  { value: "Government agency", label: "Government agency", icon: Landmark },
];

export const leadScenariosFiltersSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  language: z.string(),
  job_title: z.string(),
  job_tenure_from: z.string(),
  job_tenure_to: z.string(),
  past_job_title: z.string(),
  department: z.string(),
  seniority: z.array(z.string()),
  seniority_exclude: z.array(z.string()),
  experience_years_from: z.string(),
  experience_years_to: z.string(),
  school: z.string(),
  location: z.string(),
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
  company_headcount_from: z.string(),
  company_headcount_to: z.string(),
  company_industry: z.string(),
  company_location: z.string(),
  company_type: z.array(z.string()),
  company_tenure_from: z.string(),
  company_tenure_to: z.string(),
});

const CreateLeadScenarios = () => {
  const [activeStep, setActiveStep] = useState(0);
  const searchParams = useSearchParams();
  const scenarioId = searchParams.get("scenarioId");
  const [newPreset, setNewPreset] = useState("");
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(
    null
  );

  const handleLoadFilter = (id: string) => {
    setSelectedScenarioId(id);
  };

  const { createLeadFilter, leadFilterById } = useLeadFilters({
    enableFetch: false,
    filterId: selectedScenarioId,
  });

  const { leadScenarioById } = useLeadScenarios({
    enableFetch: false,
    scenarioId,
  });

  const form = useForm({
    resolver: zodResolver(leadScenariosFiltersSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      language: "",
      job_title: "",
      job_tenure_from: "",
      job_tenure_to: "",
      past_job_title: "",
      department: "",
      seniority: [],
      seniority_exclude: [],
      experience_years_from: "",
      experience_years_to: "",
      school: "",
      location: "",
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
      company_headcount_from: "",
      company_headcount_to: "",
      company_industry: "",
      company_location: "",
      company_type: [],
      company_tenure_from: "",
      company_tenure_to: "",
    },
  });

  async function onSubmit(values: z.infer<typeof leadScenariosFiltersSchema>) {
    if (scenarioId && newPreset) {
      const payload = preparePayload(values, scenarioId, newPreset);

      await createLeadFilter(payload);
      setNewPreset("");
    }
  }

  useEffect(() => {
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
      Object.entries(updatedValues).forEach(([key, value]) => {
        //@ts-expect-error value is a type of unkwown
        form.setValue(key as keyof typeof updatedValues, value, {
          shouldDirty: true,
        });
      });

      form.trigger();
    }
  }, [leadScenarioById, leadFilterById, form]);

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
                      <Accordion type="single" collapsible>
                        <AccordionItem value="name" className="bg-slate-200">
                          <AccordionTrigger className="p-3">
                            🧑 Name
                          </AccordionTrigger>
                          <AccordionContent className="p-3">
                            <FormField
                              control={form.control}
                              name="first_name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      placeholder="First Name"
                                      className="mb-3"
                                      {...field}
                                    />
                                  </FormControl>

                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="last_name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      placeholder="Last name"
                                      className="mb-3"
                                      {...field}
                                    />
                                  </FormControl>

                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

                      <Accordion type="single" collapsible>
                        <AccordionItem value="name" className="bg-slate-200">
                          <AccordionTrigger className="p-3">
                            💬 Language
                          </AccordionTrigger>
                          <AccordionContent className="p-3">
                            <FormField
                              control={form.control}
                              name="language"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      placeholder="Profile Language"
                                      className="mb-3"
                                      {...field}
                                    />
                                  </FormControl>

                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>

                    <div className="flex flex-col gap-4">
                      <h4 className="">👔 Professional profile</h4>
                      <div className="flex flex-col gap-4">
                        <Accordion type="single" collapsible>
                          <AccordionItem value="name" className="bg-slate-200">
                            <AccordionTrigger className="p-3">
                              🔨 Job title
                            </AccordionTrigger>
                            <AccordionContent className="p-3">
                              <div className="flex gap-2 flex-col">
                                <h4>
                                  Target individuals holding a specific position
                                  or role.
                                </h4>
                                <div className="flex gap-2">
                                  <FormField
                                    control={form.control}
                                    name="job_title"
                                    render={({ field }) => (
                                      <FormItem className="flex-1">
                                        <FormControl>
                                          <Input
                                            placeholder="Search by job title..."
                                            className="mb-3"
                                            {...field}
                                          />
                                        </FormControl>

                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <Button type="button">Search</Button>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                        <Accordion type="single" collapsible>
                          <AccordionItem value="name" className="bg-slate-200">
                            <AccordionTrigger className="p-3">
                              🕰️ 🔨 Past job title
                            </AccordionTrigger>
                            <AccordionContent className="p-3">
                              <div className="flex gap-2 flex-col">
                                <h4>
                                  Search for individuals based on their previous
                                  work experience.
                                </h4>
                                <div className="flex gap-2">
                                  <FormField
                                    control={form.control}
                                    name="past_job_title"
                                    render={({ field }) => (
                                      <FormItem className="flex-1">
                                        <FormControl>
                                          <Input
                                            placeholder="Search by past job title..."
                                            className="mb-3"
                                            {...field}
                                          />
                                        </FormControl>

                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <Button>Search</Button>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                        <Accordion type="single" collapsible>
                          <AccordionItem value="name" className="bg-slate-200">
                            <AccordionTrigger className="p-3">
                              ⏳🔨 Tenure at job title
                            </AccordionTrigger>
                            <AccordionContent className="p-3">
                              <div className="flex gap-2 flex-col">
                                <h4>
                                  Find people based on how long they&apos;ve
                                  been in their current role.
                                </h4>
                                <div className="flex flex-col">
                                  <FormField
                                    control={form.control}
                                    name="job_tenure_from"
                                    render={({ field }) => (
                                      <FormItem className="flex-1">
                                        <FormControl>
                                          <Input
                                            placeholder="Tenure at Job Title (From)"
                                            className="mb-3"
                                            {...field}
                                          />
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
                                          <Input
                                            className="mb-3"
                                            {...field}
                                            placeholder="Tenure at Job Title (To)"
                                          />
                                        </FormControl>

                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <Button className="max-w-fit">Search</Button>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                        <Accordion type="single" collapsible>
                          <AccordionItem value="name" className="bg-slate-200">
                            <AccordionTrigger className="p-3">
                              💼 Department
                            </AccordionTrigger>
                            <AccordionContent className="p-3">
                              <div className="flex gap-2 flex-col">
                                <h4>
                                  Target individuals working in specific areas
                                  or divisions within a company.
                                </h4>
                                <div className="flex gap-2">
                                  <FormField
                                    control={form.control}
                                    name="department"
                                    render={({ field }) => (
                                      <FormItem className="flex-1">
                                        <FormControl>
                                          <Input
                                            placeholder="Search by job department..."
                                            className="mb-3"
                                            {...field}
                                          />
                                        </FormControl>

                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <Button>Search</Button>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>

                        <Accordion type="single" collapsible>
                          <AccordionItem value="name" className="bg-slate-200">
                            <AccordionTrigger className="p-3">
                              🧓 Include Seniority
                            </AccordionTrigger>
                            <AccordionContent className="p-3">
                              <div className="flex gap-2 flex-col">
                                <h4>
                                  Find people based on their level of
                                  responsibility and experience within their
                                  company.
                                </h4>
                                <div className="flex gap-2">
                                  <FormField
                                    control={form.control}
                                    name="seniority"
                                    render={({ field }) => (
                                      <FormItem className="flex-1">
                                        <FormControl>
                                          <MultiSelect
                                            options={seniorityList}
                                            onValueChange={(value) =>
                                              field.onChange(value)
                                            }
                                            defaultValue={field.value || []}
                                            placeholder="Select seniorities"
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
                                  <Button>Search</Button>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>

                        <Accordion type="single" collapsible>
                          <AccordionItem value="name" className="bg-slate-200">
                            <AccordionTrigger className="p-3">
                              🧓 Exclude Seniority
                            </AccordionTrigger>
                            <AccordionContent className="p-3">
                              <div className="flex gap-2 flex-col">
                                <h4>
                                  Find people based on their level of
                                  responsibility and experience within their
                                  company.
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
                                  <Button>Search</Button>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>

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
                                <div className="flex flex-col">
                                  <FormField
                                    control={form.control}
                                    name="experience_years_from"
                                    render={({ field }) => (
                                      <FormItem className="flex-1">
                                        <FormControl>
                                          <Input
                                            className="mb-3"
                                            {...field}
                                            placeholder="From (in years)"
                                          />
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
                                          <Input
                                            className="mb-3"
                                            {...field}
                                            placeholder="To (in years)"
                                          />
                                        </FormControl>

                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <Button className="max-w-fit">Search</Button>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>

                        <Accordion type="single" collapsible>
                          <AccordionItem value="name" className="bg-slate-200">
                            <AccordionTrigger className="p-3">
                              🕰️🏢 Past company
                            </AccordionTrigger>
                            <AccordionContent className="p-3">
                              <div className="flex gap-2 flex-col">
                                <h4>
                                  Target individuals who were previously
                                  employed at specific companies.
                                </h4>
                                <div className="flex gap-2">
                                  <FormField
                                    control={form.control}
                                    name="past_company"
                                    render={({ field }) => (
                                      <FormItem className="flex-1">
                                        <FormControl>
                                          <Input
                                            className="mb-3"
                                            {...field}
                                            placeholder="Search by company name..."
                                          />
                                        </FormControl>

                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <Button className="max-w-fit">Search</Button>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>

                        <Accordion type="single" collapsible>
                          <AccordionItem value="name" className="bg-slate-200">
                            <AccordionTrigger className="p-3">
                              🏢📍 Company location
                            </AccordionTrigger>
                            <AccordionContent className="p-3">
                              <div className="flex gap-2 flex-col">
                                <h4>
                                  Target individuals working at companies
                                  located in specific geographical areas.
                                </h4>
                                <div className="flex gap-2">
                                  <FormField
                                    control={form.control}
                                    name="company_location"
                                    render={({ field }) => (
                                      <FormItem className="flex-1">
                                        <FormControl>
                                          <Input
                                            className="mb-3"
                                            {...field}
                                            placeholder="Search by location"
                                          />
                                        </FormControl>

                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <Button className="max-w-fit">Search</Button>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>

                        <Accordion type="single" collapsible>
                          <AccordionItem value="name" className="bg-slate-200">
                            <AccordionTrigger className="p-3">
                              🏭 Industry
                            </AccordionTrigger>
                            <AccordionContent className="p-3">
                              <div className="flex gap-2 flex-col">
                                <h4>
                                  Find individuals working in specific sectors
                                  or fields.
                                </h4>
                                <div className="flex gap-2">
                                  <FormField
                                    control={form.control}
                                    name="company_industry"
                                    render={({ field }) => (
                                      <FormItem className="flex-1">
                                        <FormControl>
                                          <Input
                                            className="mb-3"
                                            {...field}
                                            placeholder="Search by industry..."
                                          />
                                        </FormControl>

                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <Button className="max-w-fit">Search</Button>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>

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
                                <div className="flex flex-col">
                                  <FormField
                                    control={form.control}
                                    name="company_headcount_from"
                                    render={({ field }) => (
                                      <FormItem className="flex-1">
                                        <FormControl>
                                          <Input
                                            className="mb-3"
                                            {...field}
                                            placeholder="From (in no. empoyees)"
                                          />
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
                                          <Input
                                            className="mb-3"
                                            {...field}
                                            placeholder="To (in no. empoyees))"
                                          />
                                        </FormControl>

                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <Button className="max-w-fit">Search</Button>
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
                                <div className="flex flex-col">
                                  <FormField
                                    control={form.control}
                                    name="company_tenure_from"
                                    render={({ field }) => (
                                      <FormItem className="flex-1">
                                        <FormControl>
                                          <Input
                                            className="mb-3"
                                            {...field}
                                            placeholder="From (in years)"
                                          />
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
                                          <Input
                                            className="mb-3"
                                            {...field}
                                            placeholder="To (in years))"
                                          />
                                        </FormControl>

                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <Button className="max-w-fit">Search</Button>
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
                                  <Button>Search</Button>
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
                                                  <SelectItem value="1st">
                                                    1st
                                                  </SelectItem>
                                                  <SelectItem value="2nd">
                                                    2nd
                                                  </SelectItem>
                                                  <SelectItem value="3rd">
                                                    3rd
                                                  </SelectItem>
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

                                    <Button>Search</Button>
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
                                    <Button>Search</Button>
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <h4>🏫 School</h4>
                      <div className="bg-slate-200">
                        <div className="p-3">
                          <div className="flex gap-2 flex-col">
                            <h4>
                              Search for individuals based on their educational
                              background and institutions attended.
                            </h4>
                            <div className="flex gap-2">
                              <FormField
                                control={form.control}
                                name="school"
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormControl>
                                      <Input
                                        className="mb-3"
                                        {...field}
                                        placeholder="Search by school..."
                                      />
                                    </FormControl>

                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <Button>Search</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="border-b-0">
                        <h4 className="p-3">📍 Location</h4>
                        <div className="p-3 bg-slate-200">
                          <div className="flex gap-3 flex-col">
                            <h4>
                              Find individuals based on their current
                              geographical location.
                            </h4>
                            <div className="flex gap-2">
                              <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormControl>
                                      <Input
                                        className="mb-3"
                                        {...field}
                                        placeholder="Search by location..."
                                      />
                                    </FormControl>

                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <Button>Search</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <LeadScenariousPresets
                  setNewPreset={setNewPreset}
                  newPreset={newPreset}
                  handleLoadFilter={handleLoadFilter}
                />
              </form>
            </Form>
          )}
        </>
      )}
    </div>
  );
};

export default CreateLeadScenarios;
