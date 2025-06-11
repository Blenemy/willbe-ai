import { z } from "zod";

const searchOptionSchema = z.object({
  title: z.string(),
  id: z.string(),
});

const compareFromTo = (
  from: string | undefined,
  to: string | undefined
): boolean => {
  if (!from || !to) return true;
  return Number(from) <= Number(to);
};

export const accountScenarioFormSchema = z
  .object({
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
  })
  .refine((data) => compareFromTo(data.headcount_from, data.headcount_to), {
    message: "Headcount From must be less than or equal to To",
    path: ["headcount_to"],
  })
  .refine(
    (data) =>
      compareFromTo(data.headcount_growth_from, data.headcount_growth_to),
    {
      message: "Headcount Growth From must be less than or equal to To",
      path: ["headcount_growth_to"],
    }
  )
  .refine((data) => compareFromTo(data.fortune_from, data.fortune_to), {
    message: "Fortune From must be less than or equal to To",
    path: ["fortune_to"],
  })
  .refine(
    (data) => compareFromTo(data.followers_count_from, data.followers_count_to),
    {
      message: "Followers Count From must be less than or equal to To",
      path: ["followers_count_to"],
    }
  )
  .refine(
    (data) =>
      compareFromTo(
        data.department_headcount_from,
        data.department_headcount_to
      ),
    {
      message: "Department Headcount From must be less than or equal to To",
      path: ["department_headcount_to"],
    }
  )
  .refine(
    (data) =>
      compareFromTo(
        data.department_headcount_growth_from,
        data.department_headcount_growth_to
      ),
    {
      message:
        "Department Headcount Growth From must be less than or equal to To",
      path: ["department_headcount_growth_to"],
    }
  )
  .refine(
    (data) => compareFromTo(data.annual_revenue_from, data.annual_revenue_to),
    {
      message: "Annual Revenue From must be less than or equal to To",
      path: ["annual_revenue_to"],
    }
  );

export const getAccountScenarioFormSchema = (t: (key: string) => string) =>
  z
    .object({
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
    })
    .refine((data) => compareFromTo(data.headcount_from, data.headcount_to), {
      message: t("headcount_range_invalid"),
      path: ["headcount_to"],
    })
    .refine(
      (data) =>
        compareFromTo(data.headcount_growth_from, data.headcount_growth_to),
      {
        message: t("headcount_growth_range_invalid"),
        path: ["headcount_growth_to"],
      }
    )
    .refine((data) => compareFromTo(data.fortune_from, data.fortune_to), {
      message: t("fortune_range_invalid"),
      path: ["fortune_to"],
    })
    .refine(
      (data) =>
        compareFromTo(data.followers_count_from, data.followers_count_to),
      {
        message: t("followers_count_range_invalid"),
        path: ["followers_count_to"],
      }
    )
    .refine(
      (data) =>
        compareFromTo(
          data.department_headcount_from,
          data.department_headcount_to
        ),
      {
        message: t("department_headcount_range_invalid"),
        path: ["department_headcount_to"],
      }
    )
    .refine(
      (data) =>
        compareFromTo(
          data.department_headcount_growth_from,
          data.department_headcount_growth_to
        ),
      {
        message: t("department_headcount_growth_range_invalid"),
        path: ["department_headcount_growth_to"],
      }
    )
    .refine(
      (data) => compareFromTo(data.annual_revenue_from, data.annual_revenue_to),
      {
        message: t("annual_revenue_range_invalid"),
        path: ["annual_revenue_to"],
      }
    );
