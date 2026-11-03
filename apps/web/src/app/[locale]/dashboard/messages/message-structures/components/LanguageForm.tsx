/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useTranslations } from "next-intl";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Wand2 } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { protectedAxiosInstance } from "@/api/axiosInstance";
import { useMessageTemplates } from "@/hooks/useMessageTemplates";
import { useParams } from "next/navigation";
import { useEffect } from "react";

const schema = z.object({
  objective: z.string().min(1, "Required"),

  subject: z.string().optional(),
  greeting: z.string().min(1, "Required"),

  introduction: z.object({
    text: z.string().min(1, "Required"),
    wordsLimit: z.string().min(1, "Required"),
  }),

  body: z
    .array(
      z.object({
        text: z.string().min(1, "Required"),
        wordsLimit: z.string().min(1, "Required"),
      })
    )
    .min(1, "At least one paragraph is required"),

  goodbye: z.object({
    text: z.string().min(1, "Required"),
    wordsLimit: z.string().min(1, "Required"),
  }),

  sample: z.string().min(1, "Required"),
});

type LanguageFormValues = z.infer<typeof schema>;

interface Props {
  languageCode: string;
  subjectType?: string;
}

export function LanguageForm({ languageCode, subjectType }: Props) {
  const t = useTranslations("MessageStructures");
  const { id: structureId } = useParams();
  const {
    createTemplate,
    updateTemplate,
    hasTemplate,
    fetchTemplateId,
    deleteTemplate,
  } = useMessageTemplates();

  const form = useForm<LanguageFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      objective: "",
      subject: "",
      greeting: "",
      introduction: { text: "", wordsLimit: "" },
      body: [{ text: "", wordsLimit: "" }],
      goodbye: { text: "", wordsLimit: "" },
      sample: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "body",
  });

  useEffect(() => {
    const loadTemplate = async () => {
      const data = await fetchTemplateId(structureId as string, languageCode);

      if (!data) {
        form.reset();
        return;
      }

      const paragraphs = data.paragraphs?.length
        ? data.paragraphs.map((p: any) => ({
            text: p.text || "",
            wordsLimit: p.wordsLimit?.toString() || "",
          }))
        : [{ text: "", wordsLimit: "" }];

      form.reset({
        objective: data.objective || "",
        subject: data.subject || "",
        greeting: data.greeting || "",
        introduction: {
          text: data.introduction?.text || "",
          wordsLimit: data.introduction?.wordsLimit?.toString() || "",
        },
        body: paragraphs,
        goodbye: {
          text: data.goodbye?.text || "",
          wordsLimit: data.goodbye?.wordsLimit?.toString() || "",
        },
        sample: data.sampleMessage || "",
      });
    };

    loadTemplate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [structureId, languageCode, form]);

  const insertFriendly = async (field: string, index?: number) => {
    let type = field;
    if (field === "body" && typeof index === "number") {
      type = `paragraph_${index + 1}`;
    } else if (field === "sample") {
      type = "sample_message";
    }

    try {
      const res = await protectedAxiosInstance.get(
        "/auth/message-templates/example-templates/friendly",
        { params: { language: languageCode, type } }
      );
      const value = res.data.value;

      if (field === "introduction" || field === "goodbye") {
        form.setValue(`${field}.text`, value);
      } else if (field === "body" && typeof index === "number") {
        form.setValue(`body.${index}.text`, value);
      } else {
        form.setValue(field as any, value);
      }
    } catch {
      toast.error(t("no_friendly_text"));
    }
  };

  const handleErase = async () => {
    await deleteTemplate(languageCode);
  };

  const handleSave = async () => {
    const data = form.getValues();
    const payload = {
      objective: data.objective,
      subject: data.subject,
      greeting: data.greeting,
      introduction: {
        text: data.introduction.text,
        wordsLimit: Number(data.introduction.wordsLimit || 0),
      },
      paragraphs: data.body.map((p) => ({
        text: p.text,
        wordsLimit: Number(p.wordsLimit || 0),
      })),
      goodbye: {
        text: data.goodbye.text,
        wordsLimit: Number(data.goodbye.wordsLimit || 0),
      },
      sampleMessage: data.sample,
    };

    try {
      if (!hasTemplate(languageCode)) {
        await createTemplate({
          language: languageCode,
          structureId: structureId as string,
          payload,
        });
      } else {
        await updateTemplate({ language: languageCode, data: payload });
      }
    } catch {
      toast.error(t("error_saving"));
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-4 mt-4" onSubmit={form.handleSubmit(handleSave)}>
        <FormField
          name="objective"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">
                {t("objective")}
              </FormLabel>
              <FormControl>
                <Input placeholder={t("objective")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {subjectType?.includes("text") && (
          <FormField
            name="subject"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">
                  {t("subject")}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("subject_text_placeholder")}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        <FormField
          name="greeting"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">{t("greeting")}</FormLabel>
              <FormControl>
                <Input placeholder={t("greeting")} {...field} />
              </FormControl>
              <FormMessage />
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => insertFriendly("greeting")}
              >
                <Wand2 className="w-4 h-4" /> {t("friendly")}
              </Button>
            </FormItem>
          )}
        />

        <FormField
          name="introduction.text"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">
                {t("introduction")}
              </FormLabel>
              <FormControl>
                <Textarea placeholder={t("text")} {...field} />
              </FormControl>
              <FormMessage />
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => insertFriendly("introduction")}
              >
                <Wand2 className="w-4 h-4" /> {t("friendly")}
              </Button>
            </FormItem>
          )}
        />
        <FormField
          name="introduction.wordsLimit"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">
                {t("words_limit")}
              </FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormLabel className="font-semibold">{t("body_paragraphs")}</FormLabel>

        {fields.map((item, index) => (
          <div key={item.id} className="border rounded p-4 space-y-2">
            <FormField
              name={`body.${index}.text`}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">
                    {t("paragraph", { index: index + 1 })}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("paragraph_text_placeholder")}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name={`body.${index}.wordsLimit`}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">
                    {t("words_limit")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={t("paragraph_limit_placeholder")}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2 items-center">
              <Button
                type="button"
                size="icon"
                onClick={() => append({ text: "", wordsLimit: "" })}
              >
                <Plus className="w-4 h-4" />
              </Button>

              {fields.length > 1 && (
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  onClick={() => remove(index)}
                >
                  <Minus className="w-4 h-4" />
                </Button>
              )}

              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => insertFriendly("body", index)}
              >
                <Wand2 className="w-4 h-4" /> {t("friendly")}
              </Button>
            </div>
          </div>
        ))}

        <FormField
          name="goodbye.text"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">{t("goodbye")}</FormLabel>
              <FormControl>
                <Textarea placeholder={t("text")} {...field} />
              </FormControl>

              <FormMessage />
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => insertFriendly("goodbye")}
              >
                <Wand2 className="w-4 h-4" /> {t("friendly")}
              </Button>
            </FormItem>
          )}
        />
        <FormField
          name="goodbye.wordsLimit"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">
                {t("words_limit")}
              </FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="sample"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">
                {t("sample_email")}
              </FormLabel>
              <FormControl>
                <Textarea placeholder={t("sample_placeholder")} {...field} />
              </FormControl>

              <FormMessage />
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => insertFriendly("sample")}
              >
                <Wand2 className="w-4 h-4" /> {t("friendly")}
              </Button>
            </FormItem>
          )}
        />

        <div className="flex gap-2 pt-2">
          <Button type="button" variant="destructive" onClick={handleErase}>
            {t("erase")}
          </Button>
          <Button type="submit">{t("save")}</Button>
        </div>
      </form>
    </Form>
  );
}
