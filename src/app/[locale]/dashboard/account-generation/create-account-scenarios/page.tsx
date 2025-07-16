"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
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
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useAccountScenariosDropdowns } from "@/hooks/useDropdownOptionsQuery";
import FormAccordion from "../../lead-generation/create-lead-scenarios/components/formComponents/FormAccordion";
import AccountNameForm from "./components/AccountNameForm";
import {
  getAccountScenarioFormSchema,
  AccountScenariosType,
} from "@/schemas/accountScenarioFormSchema";
import MultiSelectWithSearchButton from "./components/formComponents/MultiSelectWithSearchButton";
import { Button } from "@/components/ui/button";
import { prepareAccountPayload } from "@/utils/prepareAccountPayload";
import { useAccountScenarios } from "@/hooks/useAccountScenarios";
import { transformFilterValues } from "@/utils/transformFilterValues";
import AccountTable from "./components/AccountTable/AccountTable";
import { XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { ScenarioSidebarLite } from "@/components/ScenarioSidebar/ScenarioSidebar";
import AccountSave from "./components/AccountSave/AccountSave";
import { useQueryClient } from "@tanstack/react-query";
import { RangeSelectPair } from "@/components/RangeSelectPair/RangePairSelect";

const CreateAccountScenarios = () => {
  const searchParams = useSearchParams();
  const accountId = searchParams.get("accountId");
  const accountName = searchParams.get("accountName");
  const t = useTranslations("scenariosFilter");
  const tErrors = useTranslations("scenariosFilter.annual_revenue.errors");
  const {
    updateAccountScenario,
    accountScenarioById,
    isLoadingScenarioId,
    refetchAccountScenarioById,
  } = useAccountScenarios({
    enableFetch: true,
    accountId,
  });
  const queryClient = useQueryClient();

  const { data: dropdowns } = useAccountScenariosDropdowns();

  const defaultAccountScenarioValues: AccountScenariosType = {
    industry: "",
    industry_include: [],
    industry_exclude: [],

    location: "",
    location_include: [],
    location_exclude: [],

    headcount_from: undefined,
    headcount_to: undefined,

    headcount_growth_from: undefined,
    headcount_growth_to: undefined,

    fortune_from: undefined,
    fortune_to: undefined,

    followers_count_from: undefined,
    followers_count_to: undefined,

    recent_activities: "",

    has_job_offers: false,

    technology_search_input: "",
    technology: [],

    network_distance: "",

    keywords: "",

    department_headcount_growth_from: undefined,
    department_headcount_growth_to: undefined,

    department_headcount_from: undefined,
    department_headcount_to: undefined,

    saved_accounts: "",
    saved_accounts_include: [],
    saved_accounts_exclude: [],

    annual_revenue_from: "",
    annual_revenue_to: "",

    annual_revenue_currency: "",
  };

  const form: UseFormReturn<AccountScenariosType> =
    useForm<AccountScenariosType>({
      resolver: zodResolver(getAccountScenarioFormSchema(tErrors)),
      defaultValues: defaultAccountScenarioValues,
      mode: "onChange",
    });

  async function onSubmit(values: AccountScenariosType) {
    if (accountId && accountName) {
      const payload = prepareAccountPayload(values, accountName);

      updateAccountScenario({
        accountId,
        payload,
        shouldUpdateQueryParamsName: false,
      });
    }
  }

  const handleClearAll = () => {
    form.reset(defaultAccountScenarioValues);
    form.trigger();
  };

  useEffect(() => {
    if (!accountScenarioById) return;

    const updatedValues = transformFilterValues(
      accountScenarioById.filterValues
    );

    Object.entries(updatedValues).forEach(([key, value]) => {
      //@ts-expect-error value is a type of unknown
      form.setValue(key as keyof typeof updatedValues, value, {
        shouldDirty: true,
      });
    });

    form.trigger();
  }, [accountScenarioById, form]);

  useEffect(() => {
    if (accountId) {
      refetchAccountScenarioById();
    }
  }, [accountId, refetchAccountScenarioById]);

  const watchRevenueFrom = form.watch("annual_revenue_from");
  const watchRevenueTo = form.watch("annual_revenue_to");
  const watchCurrency = form.watch("annual_revenue_currency");

  const hasAnnualRevenueError =
    !watchRevenueFrom || !watchRevenueTo || !watchCurrency;

  const clearField = (from: string, to?: string) => {
    form.setValue(from as keyof AccountScenariosType, undefined, {
      shouldValidate: true,
    });
    if (to) form.trigger(to as keyof AccountScenariosType);
  };

  const hasSavedData =
    !!accountScenarioById?.filterValues &&
    Object.keys(accountScenarioById.filterValues).length > 0;

  console.log(hasSavedData);

  return (
    <div className="w-full px-6 py-10 flex flex-col">
      <h2 className="mb-5 font-semibold text-2xl">{t("title")}</h2>

      <AccountNameForm />

      {accountId && (
        <ScenarioSidebarLite
          form={form}
          fieldMap={{
            Industry: ["industry_include", "industry_exclude"],
            Location: ["location_include", "location_exclude"],
            Headcount: ["headcount_from", "headcount_to"],
            "Headcount Growth": [
              "headcount_growth_from",
              "headcount_growth_to",
            ],
            "Fortune 500 List": ["fortune_from", "fortune_to"],
            "Followers Count": ["followers_count_from", "followers_count_to"],
            "Recent Activities": ["recent_activities"],
            "Has Job Offers": ["has_job_offers"],
            Technology: ["technology"],
            "Network Distance": ["network_distance"],
            Keywords: ["keywords"],
            "Department Headcount": [
              "department_headcount_from",
              "department_headcount_to",
            ],
            "Department Headcount Growth": [
              "department_headcount_growth_from",
              "department_headcount_growth_to",
            ],
            "Saved Accounts": [
              "saved_accounts_include",
              "saved_accounts_exclude",
            ],
            "Annual Revenue": [
              "annual_revenue_from",
              "annual_revenue_to",
              "annual_revenue_currency",
            ],
          }}
          sidebarIconsWithLabels={[
            { icon: "🏭", label: "Industry" },
            { icon: "📍", label: "Location" },
            { icon: "👥", label: "Headcount" },
            { icon: "📈", label: "Headcount Growth" },
            { icon: "💰", label: "Fortune 500 List" },
            { icon: "🙋", label: "Followers Count" },
            { icon: "📣", label: "Recent Activities" },
            { icon: "💼", label: "Has Job Offers" },
            { icon: "💻", label: "Technology" },
            { icon: "🌍", label: "Network Distance" },
            { icon: "🏷", label: "Keywords" },
            { icon: "👔", label: "Department Headcount" },
            { icon: "📉", label: "Department Headcount Growth" },
            { icon: "📋", label: "Saved Accounts" },
            { icon: "🗓", label: "Annual Revenue" },
          ]}
          sidebarContent={
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-4">
                  <h4 className="">🗃️ {t("title")}</h4>
                  <FormAccordion label={`${t("industry.label")}`}>
                    <MultiSelectWithSearchButton
                      label={t("industry.label")}
                      form={form}
                      searchName="industry"
                      placeholder={t("industry.placeholder")}
                      searchType="INDUSTRY"
                      includeName="industry_include"
                      excludeName="industry_exclude"
                    />
                  </FormAccordion>
                  <FormAccordion label={`${t("location.label")}`}>
                    <MultiSelectWithSearchButton
                      label={t("location.label")}
                      form={form}
                      searchName="location"
                      placeholder={t("location.placeholder")}
                      searchType="LOCATION"
                      includeName="location_include"
                      excludeName="location_exclude"
                    />
                  </FormAccordion>
                  <FormAccordion label={`${t("headcount.label")}`}>
                    <div className="flex gap-2 flex-col">
                      <h4>{t("headcount.description")}</h4>
                      <RangeSelectPair
                        fromName="headcount_from"
                        toName="headcount_to"
                        fromOptions={dropdowns?.headcounts.from ?? []}
                        toOptions={dropdowns?.headcounts.to ?? []}
                        placeholderFrom={t("headcount.from")}
                        placeholderTo={t("headcount.to")}
                        clearField={clearField}
                      />
                    </div>
                  </FormAccordion>
                  <FormAccordion label={`${t("headcount_growth.label")}`}>
                    <div className="flex gap-2 flex-col">
                      <h4>{t("headcount_growth.description")}</h4>
                      <RangeSelectPair
                        fromName="headcount_growth_from"
                        toName="headcount_growth_to"
                        fromOptions={dropdowns?.headcounts.from ?? []}
                        toOptions={dropdowns?.headcounts.to ?? []}
                        placeholderFrom={t("headcount.from")}
                        placeholderTo={t("headcount.to")}
                        clearField={clearField}
                      />
                    </div>
                  </FormAccordion>
                  <FormAccordion label={`${t("fortune.label")}`}>
                    <div className="flex gap-2 flex-col">
                      <h4>{t("fortune.description")}</h4>
                      <RangeSelectPair
                        fromName="fortune_from"
                        toName="fortune_to"
                        fromOptions={dropdowns?.fortunes.from ?? []}
                        toOptions={dropdowns?.fortunes.to ?? []}
                        placeholderFrom={t("headcount.from")}
                        placeholderTo={t("headcount.to")}
                        clearField={clearField}
                      />
                    </div>
                  </FormAccordion>
                  <FormAccordion label={`${t("followers.label")}`}>
                    <div className="flex gap-2 flex-col">
                      <h4>{`${t("followers.description")}`}</h4>
                      <RangeSelectPair
                        fromName="followers_count_from"
                        toName="followers_count_to"
                        fromOptions={dropdowns?.followersCounts.from ?? []}
                        toOptions={dropdowns?.followersCounts.to ?? []}
                        placeholderFrom={t("headcount.from")}
                        placeholderTo={t("headcount.to")}
                        clearField={clearField}
                      />
                    </div>
                  </FormAccordion>
                </div>
                <div className="flex flex-col gap-4">
                  <h4>{`${t("activity_focus")}`}</h4>
                  <div className="flex flex-col gap-4">
                    <FormAccordion label={`${t("recent_activities.label")}`}>
                      <FormField
                        control={form.control}
                        name="recent_activities"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Select
                                key={field.value}
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger className="flex h-10 w-full items-center justify-between gap-2 px-3">
                                  <div className="flex items-center flex-1 overflow-hidden">
                                    <SelectValue
                                      placeholder={`${t(
                                        "recent_activities.placeholder"
                                      )}`}
                                      className="truncate"
                                    />
                                  </div>

                                  {field.value && (
                                    <XIcon
                                      className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-destructive"
                                      onPointerDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        form.setValue("recent_activities", "");
                                      }}
                                    />
                                  )}
                                </SelectTrigger>

                                <SelectContent>
                                  <SelectGroup>
                                    {dropdowns?.recentActivities.map(
                                      ({
                                        value,
                                        title,
                                      }: {
                                        value: string;
                                        title: string;
                                      }) => (
                                        <SelectItem value={value} key={value}>
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
                    </FormAccordion>

                    <div className="flex justify-between items-center bg-slate-200 p-3">
                      <span>{`${t("has_job_offers")}`}</span>
                      <FormField
                        control={form.control}
                        name="has_job_offers"
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

                    <FormAccordion label={`${t("technology.label")}`}>
                      <MultiSelectWithSearchButton
                        label={`${t("technology.description")}`}
                        form={form}
                        searchName="technology_search_input"
                        valueName="technology"
                        placeholder={`${t("technology.placeholder")}`}
                        searchType="TECHNOLOGIES"
                        isSingleSelect
                      />
                    </FormAccordion>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <h4>{t("connections")}</h4>
                  <Accordion type="single" collapsible>
                    <AccordionItem
                      value="network-distance"
                      className="bg-slate-200"
                    >
                      <AccordionTrigger className="p-3">
                        {t("network_distance.label")}
                      </AccordionTrigger>
                      <AccordionContent className="p-3">
                        <div className="flex gap-2 flex-col">
                          <h4>{t("network_distance.description")}</h4>
                          <div className="flex gap-2">
                            <FormField
                              control={form.control}
                              name="network_distance"
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormControl>
                                    <Select
                                      key={field.value}
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                    >
                                      <SelectTrigger className="flex h-10 w-full items-center justify-between gap-2 px-3">
                                        <div className="flex items-center flex-1 overflow-hidden">
                                          <SelectValue
                                            placeholder={t(
                                              "network_distance.placeholder"
                                            )}
                                            className="truncate"
                                          />
                                        </div>

                                        {field.value && (
                                          <XIcon
                                            className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-destructive"
                                            onPointerDown={(e) => {
                                              e.preventDefault();
                                              e.stopPropagation();
                                              form.setValue(
                                                "network_distance",
                                                ""
                                              );
                                            }}
                                          />
                                        )}
                                      </SelectTrigger>

                                      <SelectContent>
                                        <SelectGroup>
                                          <SelectLabel>
                                            Connection degree
                                          </SelectLabel>
                                          {dropdowns?.networkDistances.map(
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
                <div className="flex flex-col gap-4">
                  <h4>{t("other_filters")}</h4>
                  <div className="flex flex-col gap-3">
                    <Accordion type="single" collapsible>
                      <AccordionItem value="keywords" className="bg-slate-200">
                        <AccordionTrigger className="p-3">
                          {t("keywords.label")}
                        </AccordionTrigger>
                        <AccordionContent className="p-3">
                          <div className="flex gap-2 flex-col">
                            <h4>{t("keywords.description")}</h4>
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
                                        placeholder={t("keywords.placeholder")}
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
                <div className="flex flex-col gap-4">
                  <h4>{t("department_filters")}</h4>
                  <div className="flex flex-col gap-4">
                    <FormAccordion label={t("department_headcount.label")}>
                      <div className="flex gap-2 flex-col">
                        <h4>{t("department_headcount.description")}</h4>
                        <RangeSelectPair
                          fromName="department_headcount_from"
                          toName="department_headcount_to"
                          fromOptions={dropdowns?.headcounts.from ?? []}
                          toOptions={dropdowns?.headcounts.to ?? []}
                          placeholderFrom={t("department_headcount.from")}
                          placeholderTo={t("department_headcount.to")}
                          clearField={clearField}
                        />
                      </div>
                    </FormAccordion>

                    <FormAccordion
                      label={t("department_headcount_growth.label")}
                    >
                      <div className="flex gap-2 flex-col">
                        <h4>{t("department_headcount_growth.description")}</h4>

                        <RangeSelectPair
                          fromName="department_headcount_growth_from"
                          toName="department_headcount_growth_to"
                          fromOptions={dropdowns?.headcounts.from ?? []}
                          toOptions={dropdowns?.headcounts.to ?? []}
                          placeholderFrom={t(
                            "department_headcount_growth.from"
                          )}
                          placeholderTo={t("department_headcount_growth.to")}
                          clearField={clearField}
                        />
                      </div>
                    </FormAccordion>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <h4>{t("saved_accounts_title")}</h4>
                  <div className="flex flex-col gap-4">
                    <FormAccordion label={t("saved_accounts.label")}>
                      <MultiSelectWithSearchButton
                        label={t("saved_accounts.description")}
                        form={form}
                        searchName="saved_accounts"
                        placeholder={t("saved_accounts.placeholder")}
                        searchType="SAVED_ACCOUNTS"
                        includeName="saved_accounts_include"
                        excludeName="saved_accounts_exclude"
                      />
                    </FormAccordion>
                  </div>
                </div>
                <FormAccordion
                  label={t("annual_revenue.label")}
                  defaultOpen
                  className={
                    hasAnnualRevenueError
                      ? "border border-red-500"
                      : "border border-border"
                  }
                >
                  <div className="flex gap-2 flex-col">
                    <h4>{t("annual_revenue.description")}</h4>
                    <div className="flex flex-col gap-3">
                      <RangeSelectPair
                        fromName="annual_revenue_from"
                        toName="annual_revenue_to"
                        fromOptions={dropdowns?.annualRevenues.from ?? []}
                        toOptions={dropdowns?.annualRevenues.to ?? []}
                        placeholderFrom={t("annual_revenue.from")}
                        placeholderTo={t("annual_revenue.to")}
                        clearField={clearField}
                      />

                      <div className="flex flex-col gap-3">
                        <FormField
                          control={form.control}
                          name="annual_revenue_currency"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Select
                                  key={field.value}
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <SelectTrigger className="flex h-10 w-full items-center justify-between gap-2 px-3">
                                    <div className="flex items-center flex-1 overflow-hidden">
                                      <SelectValue
                                        placeholder={t(
                                          "annual_revenue.currency"
                                        )}
                                        className="truncate"
                                      />
                                    </div>

                                    {field.value && (
                                      <XIcon
                                        className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-destructive"
                                        onPointerDown={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          form.setValue(
                                            "annual_revenue_currency",
                                            ""
                                          );
                                        }}
                                      />
                                    )}
                                  </SelectTrigger>

                                  <SelectContent>
                                    <SelectGroup>
                                      {dropdowns?.annualRevenues.currencies.map(
                                        (value: string) => (
                                          <SelectItem value={value} key={value}>
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
                  </div>
                </FormAccordion>

                <div className="flex gap-4 items-center justify-center flex-col">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={hasAnnualRevenueError}
                  >
                    {t("buttons.save")}
                  </Button>
                  <Button
                    type="button"
                    className="w-full"
                    disabled={!hasSavedData}
                    onClick={() => {
                      queryClient.invalidateQueries({
                        queryKey: ["account-search"],
                      });
                    }}
                  >
                    {t("buttons.search")}
                  </Button>
                  <Button
                    type="button"
                    className="text-red-500"
                    variant={"ghost"}
                    onClick={handleClearAll}
                  >
                    {t("buttons.clear")}
                  </Button>
                </div>
              </form>
            </Form>
          }
        >
          {!isLoadingScenarioId && (
            <div className="bg-white rounded-xl p-6 h-full">
              <AccountTable
                cursors={{
                  lastPageCursor: accountScenarioById?.lastPageCursor,
                  previousPageCursor: accountScenarioById?.previousPageCursor,
                }}
              />
              <AccountSave />
            </div>
          )}
        </ScenarioSidebarLite>
      )}
    </div>
  );
};

export default CreateAccountScenarios;
