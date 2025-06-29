import { z } from "zod";
import { searchOptionSchema, optionalNumber } from "./common/schemaUtils";

export const getAccountScenarioFormSchema = (t: (key: string) => string) =>
  z.object({
    industry: z.string().optional(),
    industry_include: z.array(searchOptionSchema).optional(),
    industry_exclude: z.array(searchOptionSchema).optional(),

    location: z.string().optional(),
    location_include: z.array(searchOptionSchema).optional(),
    location_exclude: z.array(searchOptionSchema).optional(),

    headcount_from: optionalNumber,
    headcount_to: optionalNumber,

    headcount_growth_from: optionalNumber,
    headcount_growth_to: optionalNumber,

    fortune_from: optionalNumber,
    fortune_to: optionalNumber,

    followers_count_from: optionalNumber,
    followers_count_to: optionalNumber,

    recent_activities: z.string().optional(),

    has_job_offers: z.boolean().optional(),

    technology_search_input: z.string().optional(),
    technology: z.array(searchOptionSchema).optional(),

    network_distance: z.string().optional(),

    keywords: z.string().optional(),

    department_headcount_growth_from: optionalNumber,
    department_headcount_growth_to: optionalNumber,

    department_headcount_from: optionalNumber,
    department_headcount_to: optionalNumber,

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
