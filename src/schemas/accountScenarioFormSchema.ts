import { z } from "zod";

const searchOptionSchema = z.object({
  title: z.string(),
  id: z.string(),
});

export const accountScenarioFormSchema = z.object({
  industry: z.string().optional(),
  industry_include: z.array(searchOptionSchema).optional(),
  industry_exclude: z.array(searchOptionSchema).optional(),

  location: z.string().optional(),
  location_include: z.array(searchOptionSchema).optional(),
  location_exclude: z.array(searchOptionSchema).optional(),

  headcount_from: z.string().optional(),
  headcount_to: z.string().optional(),

  headcount_growth_from: z.string().optional(),
  headcount_growth_to: z.string().optional(),

  fortune_from: z.string().optional(),
  fortune_to: z.string().optional(),

  followers_count_from: z.string().optional(),
  followers_count_to: z.string().optional(),

  recent_activities: z.string().optional(),

  has_job_offers: z.boolean().optional(),

  technology_search_input: z.string().optional(),
  technology: z.array(searchOptionSchema).optional(),

  network_distance: z.string().optional(),

  keywords: z.string().optional(),

  department_headcount_growth_from: z.string().optional(),
  department_headcount_growth_to: z.string().optional(),

  department_headcount_from: z.string().optional(),
  department_headcount_to: z.string().optional(),

  saved_accounts: z.string().optional(),
  saved_accounts_include: z.array(searchOptionSchema).optional(),
  saved_accounts_exclude: z.array(searchOptionSchema).optional(),

  annual_revenue_from: z
    .string()
    .min(1, { message: "Annual revenue (from) is required" }),
  annual_revenue_to: z
    .string()
    .min(1, { message: "Annual revenue (to) is required" }),
  annual_revenue_currency: z
    .string()
    .min(1, { message: "Currency is required" }),
});

export const getAccountScenarioFormSchema = (t: (key: string) => string) =>
  z.object({
    industry: z.string().optional(),
    industry_include: z.array(searchOptionSchema).optional(),
    industry_exclude: z.array(searchOptionSchema).optional(),

    location: z.string().optional(),
    location_include: z.array(searchOptionSchema).optional(),
    location_exclude: z.array(searchOptionSchema).optional(),

    headcount_from: z.string().optional(),
    headcount_to: z.string().optional(),

    headcount_growth_from: z.string().optional(),
    headcount_growth_to: z.string().optional(),

    fortune_from: z.string().optional(),
    fortune_to: z.string().optional(),

    followers_count_from: z.string().optional(),
    followers_count_to: z.string().optional(),

    recent_activities: z.string().optional(),

    has_job_offers: z.boolean().optional(),

    technology_search_input: z.string().optional(),
    technology: z.array(searchOptionSchema).optional(),

    network_distance: z.string().optional(),

    keywords: z.string().optional(),

    department_headcount_growth_from: z.string().optional(),
    department_headcount_growth_to: z.string().optional(),

    department_headcount_from: z.string().optional(),
    department_headcount_to: z.string().optional(),

    saved_accounts: z.string().optional(),
    saved_accounts_include: z.array(searchOptionSchema).optional(),
    saved_accounts_exclude: z.array(searchOptionSchema).optional(),

    annual_revenue_from: z
      .string()
      .min(1, { message: t("annual_revenue_from_required") }),
    annual_revenue_to: z
      .string()
      .min(1, { message: t("annual_revenue_to_required") }),
    annual_revenue_currency: z
      .string()
      .min(1, { message: t("annual_revenue_currency_required") }),
  });
