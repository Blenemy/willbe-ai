"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useMessageStructureForm } from "@/hooks/useMessageStructureForm";
import { LanguageForm } from "../../messages/message-structures/components/LanguageForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LanguageTranslateUI } from "../../messages/message-structures/components/LanguageTranslateUI";
import { LANGUAGES } from "@/constants/languagesMessageStructure";
import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";
import { Check } from "lucide-react";

const EMAIL_TYPES = [
  "first_email",
  "follow_up_email",
  "linkedin_connection",
  "linkedin_message",
  "linkedin_follow_up",
] as const;

const SUBJECT_TYPES = [
  "account_company",
  "account_company_text",
  "text",
] as const;

export default function MessageStructureEditor() {
  const t = useTranslations("MessageStructures");
  const { id } = useParams();
  const {
    form,
    createStructure,
    isCreating,
    currentLang,
    handleLanguageChange,
    fetchedStructure,
    updateMessageStructure,
    createdLanguages,
  } = useMessageStructureForm(id as string);

  const emailType = form.watch("emailType");
  const isFirstEmail = emailType === "first_email";
  const subjectType = form.watch("subjectType");

  const handleSave = form.handleSubmit((values) => {
    if (values.emailType === "first_email" && !values.subjectType) {
      form.setError("subjectType", { message: t("subject_type_placeholder") });
      return;
    }

    const safeId = Array.isArray(id) ? id[0] : id;

    if (safeId) {
      updateMessageStructure({ id: safeId });
    } else {
      createStructure();
    }
  });

  const createdLanguageCodes = (createdLanguages || []).map(
    (label) => LANGUAGES.find((lang) => lang.label === label)?.code || label
  );

  const backendLanguageCodes = (fetchedStructure?.languages || [])
    .map(
      (label: string) => LANGUAGES.find((lang) => lang.label === label)?.code
    )
    .filter((code: string): code is string => !!code);

  return (
    <div className="w-full px-6 py-10 flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold">
          {fetchedStructure?.name || t("create_Structure_title")}
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-slate-500">
          {fetchedStructure ? t("languages_hint") : t("details_hint")}
        </p>
      </div>

      <section className="rounded-xl border border-slate-200 bg-slate-50 p-5">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">
          {t("details_title")}
        </h2>
        <Form {...form}>
          <form className="grid gap-4 md:grid-cols-2">
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>{t("input_title_placeholder")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("input_title_placeholder")}
                      className="bg-white"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Controller
              name="emailType"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("email_type_label")}</FormLabel>
                  <Select
                    key={field.value}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder={t("email_type_placeholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {EMAIL_TYPES.map((value) => (
                        <SelectItem key={value} value={value}>
                          {t(`email_types.${value}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              name="maxWords"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("max_words_label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("max_words_placeholder")}
                      className="bg-white"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {isFirstEmail && (
              <FormField
                name="subjectType"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>{t("subject_type_label")}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white">
                          <SelectValue
                            placeholder={t("subject_type_placeholder")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SUBJECT_TYPES.map((value) => (
                          <SelectItem key={value} value={value}>
                            {t(`subject_types.${value}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </form>
        </Form>
        <div className="mt-4 flex justify-end">
          <Button
            type="button"
            onClick={handleSave}
            disabled={isCreating}
            className="bg-[#030A27]"
          >
            {id ? t("update_button") : t("create_structure_button")}
          </Button>
        </div>
      </section>

      {fetchedStructure && (
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-slate-900">
            {t("languages_title")}
          </h2>
          <Tabs
            value={currentLang}
            onValueChange={(val) => handleLanguageChange(val)}
            className="grid items-start gap-4 lg:grid-cols-[200px_1fr]"
          >
            <TabsList className="flex h-auto w-full flex-col items-stretch gap-1 bg-transparent p-0">
              {LANGUAGES.map((lang) => {
                const isSavedOnBackend = backendLanguageCodes.includes(lang.code);
                return (
                  <TabsTrigger
                    key={lang.code}
                    value={lang.code}
                    className="justify-between rounded-lg border border-transparent px-3 py-2 data-[state=active]:border-slate-200 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    {lang.label}
                    {isSavedOnBackend && (
                      <Check className="h-4 w-4 text-green-600" />
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              {LANGUAGES.map((lang) => {
                const isCreated = createdLanguageCodes.includes(lang.code);
                return (
                  <TabsContent key={lang.code} value={lang.code} className="mt-0">
                    {isCreated ? (
                      <LanguageForm
                        languageCode={lang.code}
                        subjectType={subjectType}
                      />
                    ) : (
                      <LanguageTranslateUI
                        currentLang={lang.code}
                        availableLangs={fetchedStructure?.languages || []}
                        structureId={fetchedStructure?.id}
                        handleLanguageChange={handleLanguageChange}
                      />
                    )}
                  </TabsContent>
                );
              })}
            </div>
          </Tabs>
        </section>
      )}
    </div>
  );
}
