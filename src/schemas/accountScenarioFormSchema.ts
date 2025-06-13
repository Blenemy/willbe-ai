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
  z
    .object({
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
    })
    .superRefine((data, ctx) => {
      const pairs: [keyof typeof data, keyof typeof data, string][] = [
        ["headcount_from", "headcount_to", t("headcount_range_invalid")],
        [
          "headcount_growth_from",
          "headcount_growth_to",
          t("headcount_growth_range_invalid"),
        ],
        ["fortune_from", "fortune_to", t("fortune_range_invalid")],
        [
          "followers_count_from",
          "followers_count_to",
          t("followers_count_range_invalid"),
        ],
        [
          "department_headcount_from",
          "department_headcount_to",
          t("department_headcount_range_invalid"),
        ],
        [
          "department_headcount_growth_from",
          "department_headcount_growth_to",
          t("department_headcount_growth_range_invalid"),
        ],
        [
          "annual_revenue_from",
          "annual_revenue_to",
          t("annual_revenue_range_invalid"),
        ],
      ];

      for (const [fromKey, toKey, message] of pairs) {
        const fromVal = data[fromKey];
        const toVal = data[toKey];

        const fromEmpty = fromVal === undefined || fromVal === "";
        const toEmpty = toVal === undefined || toVal === "";

        // Если одно из полей annual_revenue — и оно пустое, не продолжаем (пусть сработает .min(1))
        const isAnnualRevenue =
          fromKey === "annual_revenue_from" || toKey === "annual_revenue_to";
        if (isAnnualRevenue && (fromEmpty || toEmpty)) {
          continue; // skip comparison, let min(1) trigger
        }

        // Для остальных пар: если хотя бы одно значение пустое — тоже пропускаем сравнение
        if (fromEmpty || toEmpty) continue;

        const fromNum = Number(fromVal);
        const toNum = Number(toVal);

        if (!Number.isFinite(fromNum) || !Number.isFinite(toNum)) continue;

        if (fromNum > toNum) {
          ctx.addIssue({ code: "custom", path: [fromKey], message });
          ctx.addIssue({ code: "custom", path: [toKey], message });
        }
      }
    });

export type AccountScenariosType = z.infer<
  ReturnType<typeof getAccountScenarioFormSchema>
>;
