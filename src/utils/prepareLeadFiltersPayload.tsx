// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck

import { leadScenariosFiltersSchema } from "@/app/[locale]/dashboard/lead-generation/create-lead-scenarios/page";
import { z } from "zod";

export function preparePayload(
  values: z.infer<typeof leadScenariosFiltersSchema>,
  scenarioId: string,
  scenarioName: string
) {
  const payload = {
    leadScenarioId: scenarioId,
    name: scenarioName,
    filterValues: [],
  };

  const textFields = [
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
    "keywords",
  ];
  textFields.forEach((key) => {
    if (values[key]) {
      payload.filterValues.push({ filterKey: key, filterValue: values[key] });
    }
  });

  const booleanFields = [
    "posted_on_linkedin",
    "mentioned_in_news",
    "viewed_your_profile",
    "following_your_company",
    "past_colleague",
    "shared_experiences",
    "changed_jobs",
  ];
  booleanFields.forEach((key) => {
    if (values[key] !== undefined) {
      payload.filterValues.push({ filterKey: key, filterValue: values[key] });
    }
  });

  const arrayFields = ["seniority", "seniority_exclude", "company_type"];
  arrayFields.forEach((key) => {
    if (values[key] && values[key].length > 0) {
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

  if (values.seniority.length > 0 || values.seniority_exclude.length > 0) {
    payload.filterValues.push({
      filterKey: "job_title",
      filterValue: {
        include: values.seniority || [],
        exclude: values.seniority_exclude || [],
      },
    });
  }

  return payload;
}
