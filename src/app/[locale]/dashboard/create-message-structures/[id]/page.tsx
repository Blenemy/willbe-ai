"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
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

const EMAIL_TYPES = [
  { label: "First email", value: "first_email" },
  { label: "Follow up email", value: "follow_up_email" },
  { label: "LinkedIn Connection", value: "linkedin_connection" },
  { label: "LinkedIn Message", value: "linkedin_message" },
  { label: "LinkedIn Follow up", value: "linkedin_follow_up" },
];

const SUBJECT_TYPES = [
  { label: "Account <> Your company", value: "account_company" },
  { label: "Account <> Your company + Text", value: "account_company_text" },
  { label: "Text", value: "text" },
];

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
  } = useMessageStructureForm(id as string);

  const emailType = form.watch("emailType");
  const isFirstEmail = emailType === "first_email";
  const subjectType = form.watch("subjectType");

  const handleSave = () => {
    const safeId = Array.isArray(id) ? id[0] : id;

    if (safeId) {
      updateMessageStructure({ id: safeId });
    } else {
      createStructure();
    }
  };

  return (
    <div className="p-6 flex flex-col gap-6 w-full">
      <h1 className="text-2xl font-bold">{t("create_Structure_title")}</h1>

      <Form {...form}>
        <form className="space-y-4">
          <FormField
            name="title"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder={t("input_title_placeholder")}
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
                  onValueChange={(val) => {
                    field.onChange(val);
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("email_type_placeholder")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {EMAIL_TYPES.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
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
                <FormControl>
                  <Input placeholder={t("max_words_placeholder")} {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {isFirstEmail && (
            <FormField
              name="subjectType"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("subject_type_label")}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("subject_type_placeholder")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SUBJECT_TYPES.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          )}
        </form>
      </Form>

      <Button
        type="button"
        onClick={handleSave}
        disabled={isCreating}
        className="max-w-fit"
      >
        {id ? t("update_button") : t("create_structure_button")}
      </Button>

      <Tabs defaultValue={currentLang} onValueChange={handleLanguageChange}>
        <TabsList className="w-full justify-start overflow-x-auto">
          {LANGUAGES.map((lang) => (
            <TabsTrigger key={lang.code} value={lang.code}>
              {lang.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {LANGUAGES.map((lang) => (
          <TabsContent key={lang.code} value={lang.code} className="mt-4">
            {fetchedStructure?.languages.includes(lang.label) ? (
              <LanguageForm
                languageCode={lang.code}
                subjectType={subjectType}
              />
            ) : (
              <LanguageTranslateUI
                currentLang={lang.code}
                availableLangs={fetchedStructure?.languages || []}
                structureId={fetchedStructure?.id}
              />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
