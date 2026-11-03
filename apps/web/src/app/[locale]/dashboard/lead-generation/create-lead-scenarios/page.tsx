"use client";

import { useEffect, useMemo, useState } from "react";
import CustomStepper from "@/components/Stepper/Stepper";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ScenarioNameForm from "./components/ScenarioNameForm";
import { useSearchParams } from "next/navigation";
import { useLeadFilters } from "@/hooks/useLeadFilters";
import { preparePayload } from "@/utils/prepareLeadFiltersPayload";
import { transformFilterValues } from "@/utils/transformFilterValues";
import { useLeadScenarios } from "@/hooks/useLeadScenarious";
import {
  useDropdownOptionsQuery,
  useLanguagesQuery,
} from "@/hooks/useDropdownOptionsQuery";
import LeadTable from "./components/LeadTable/LeadTable";
import {
  emptyLeadScenarioFilters,
  leadScenariosFiltersSchema,
  LeadScenariosFormType,
} from "@/schemas/leadScenariosFiltersSchema";
import LeadsSaved from "./components/LeadsSaved/LeadsSaved";
import { useTranslations } from "next-intl";
import { LeadScenarioFiltersForm } from "./components/LeadScenarioFiltersForm";

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
    defaultValues: emptyLeadScenarioFilters,
  });

  const watchedValues = form.watch();

  const isFormEmpty = useMemo(() => {
    return Object.values(watchedValues).every((val) => {
      if (typeof val === "string") return val.trim() === "";
      if (Array.isArray(val)) return val.length === 0;
      if (typeof val === "boolean") return !val;
      return val === undefined || val === null;
    });
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
          ...emptyLeadScenarioFilters,
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
            <LeadScenarioFiltersForm
              form={form}
              onSubmit={onSubmit}
              languagesList={languagesList}
              seniorityList={seniorityList}
              companyTypeList={companyTypeList}
              data={data}
              clearField={clearField}
              newPreset={newPreset}
              setNewPreset={setNewPreset}
              handleLoadFilter={handleLoadFilter}
              setActiveStep={setActiveStep}
              leadScenarioById={leadScenarioById}
              isFormEmpty={isFormEmpty}
            />
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
