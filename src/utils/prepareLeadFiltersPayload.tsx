/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck

import { LeadScenariosFormType } from "@/app/[locale]/dashboard/lead-generation/create-lead-scenarios/page";

export function preparePayload(
  values: LeadScenariosFormType,
  scenarioId: string,
  scenarioName: string
) {
  const payload = {
    leadScenarioId: scenarioId,
    filterValues: [],
  };

  if (scenarioName) {
    payload.name = scenarioName;
  }

  const simpleFields: (keyof LeadScenariosFormType)[] = [
    "first_name",
    "last_name",
    "language",
    "job_title",
    "past_job_title",
    "department",
    "school",
    "location",
    "persona",
    "current_company",
    "past_company",
    "company_industry",
    "company_location",
    "network_distance",
    "keywords",
    "posted_on_linkedin",
    "mentioned_in_news",
    "viewed_your_profile",
    "following_your_company",
    "past_colleague",
    "shared_experiences",
    "changed_jobs",
  ];

  simpleFields.forEach((key) => {
    if (values[key]) {
      payload.filterValues.push({ filterKey: key, filterValue: values[key] });
    }
  });

  const rangeFields = [
    { from: "job_tenure_from", to: "job_tenure_to", key: "job_tenure" },
    {
      from: "experience_years_from",
      to: "experience_years_to",
      key: "experience_years",
    },
    {
      from: "company_headcount_from",
      to: "company_headcount_to",
      key: "company_headcount",
    },
    {
      from: "company_tenure_from",
      to: "company_tenure_to",
      key: "company_tenure",
    },
  ];

  rangeFields.forEach(({ from, to, key }) => {
    if (values[from] || values[to]) {
      payload.filterValues.push({
        filterKey: key,
        filterValue: { from: values[from] || "0", to: values[to] || "0" },
      });
    }
  });

  const includeExcludeFields = [
    {
      include: "job_title_include",
      exclude: "job_title_exclude",
      key: "job_title",
    },
    {
      include: "past_job_title_include",
      exclude: "past_job_title_exclude",
      key: "past_job_title",
    },
    {
      include: "department_include",
      exclude: "department_exclude",
      key: "department",
    },
    {
      include: "company_location_include",
      exclude: "company_location_exclude",
      key: "company_location",
    },
    {
      include: "company_industry_include",
      exclude: "company_industry_exclude",
      key: "company_industry",
    },
    {
      include: "past_company_include",
      exclude: "past_company_exclude",
      key: "past_company",
    },
    { include: "school_include", exclude: "school_exclude", key: "school" },
    {
      include: "location_include",
      exclude: "location_exclude",
      key: "location",
    },
  ];

  includeExcludeFields.forEach(({ include, exclude, key }) => {
    const includeValues = values[include] as
      | { title: string; id: string }[]
      | undefined;
    const excludeValues = values[exclude] as
      | { title: string; id: string }[]
      | undefined;

    if (includeValues || excludeValues) {
      payload.filterValues.push({
        filterKey: key,
        filterValue: {
          include: includeValues?.map(({ title, id }) => ({ title, id })) || [],
          exclude: excludeValues?.map(({ title, id }) => ({ title, id })) || [],
        },
      });
    }
  });

  const arrayFields = [
    "seniority_include",
    "seniority_exclude",
    "company_type",
  ];

  arrayFields.forEach((key) => {
    if (values[key] && Array.isArray(values[key]) && values[key].length > 0) {
      payload.filterValues.push({
        filterKey: key.replace("_include", "").replace("_exclude", ""),
        filterValue: values[key],
      });
    }
  });

  return payload;
}
