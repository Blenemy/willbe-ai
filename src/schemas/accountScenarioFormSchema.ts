import { z } from "zod";

const searchOptionSchema = z.object({
  title: z.string(),
  id: z.string(),
});

const optionalNumberString = z.preprocess(
  (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
  z.union([z.string(), z.undefined()])
);

export const getAccountScenarioFormSchema = (t: (key: string) => string) =>
  z.object({
    industry: z.string().optional(),
    industry_include: z.array(searchOptionSchema).optional(),
    industry_exclude: z.array(searchOptionSchema).optional(),

    location: z.string().optional(),
    location_include: z.array(searchOptionSchema).optional(),
    location_exclude: z.array(searchOptionSchema).optional(),

    headcount_from: optionalNumberString,
    headcount_to: optionalNumberString,

    headcount_growth_from: optionalNumberString,
    headcount_growth_to: optionalNumberString,

    fortune_from: optionalNumberString,
    fortune_to: optionalNumberString,

    followers_count_from: optionalNumberString,
    followers_count_to: optionalNumberString,

    recent_activities: z.string().optional(),

    has_job_offers: z.boolean().optional(),

    technology_search_input: z.string().optional(),
    technology: z.array(searchOptionSchema).optional(),

    network_distance: z.string().optional(),

    keywords: z.string().optional(),

    department_headcount_growth_from: optionalNumberString,
    department_headcount_growth_to: optionalNumberString,

    department_headcount_from: optionalNumberString,
    department_headcount_to: optionalNumberString,

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

export type AccountScenariosType = z.infer<
  ReturnType<typeof getAccountScenarioFormSchema>
>;
