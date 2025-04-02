"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useMessageStructureForm } from "@/hooks/useMessageStructureForm";
import { LanguageForm } from "../components/LanguageForm";

export const LANGUAGES = [
  { label: "English", code: "en" },
  { label: "Spanish", code: "es" },
  { label: "French", code: "fr" },
  { label: "Portuguese", code: "pt" },
  { label: "German", code: "de" },
  { label: "Italian", code: "it" },
  { label: "Hebrew", code: "he" },
];

export default function MessageStructureEditor() {
  const { id } = useParams();
  const {
    form,
    createStructure,
    isCreating,
    currentLang,
    handleLanguageChange,
  } = useMessageStructureForm(id as string);

  const emailType = form.watch("emailType");
  const isFirstEmail = emailType === "first_email";

  return (
    <div className="max-w-4xl mx-auto p-6 flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Create Message Structure</h1>

      <Form {...form}>
        <form className="space-y-4">
          <FormField
            name="title"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Title" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            name="emailType"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Email Type (e.g. first_email)"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            name="maxWords"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="number" placeholder="Max words" {...field} />
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
                  <FormControl>
                    <Input placeholder="Subject type" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          )}
        </form>
      </Form>

      <Button
        type="button"
        onClick={() => createStructure()}
        disabled={isCreating}
      >
        {isCreating ? "Creating..." : "Create structure"}
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
            <LanguageForm languageCode={lang.code} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
