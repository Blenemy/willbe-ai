"use client";

import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Wand2 } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { protectedAxiosInstance } from "@/api/axiosInstance";

const schema = z.object({
  objective: z.string().optional(),
  subject: z.string().optional(),
  greeting: z.string().optional(),
  introduction: z.object({
    text: z.string().optional(),
    maxWords: z.string().optional(),
  }),
  body: z.array(
    z.object({
      text: z.string().optional(),
      maxWords: z.string().optional(),
    })
  ),
  goodbye: z.object({
    text: z.string().optional(),
    maxWords: z.string().optional(),
  }),
  sample: z.string().optional(),
});

type LanguageFormValues = z.infer<typeof schema>;

interface Props {
  languageCode: string;
}

export function LanguageForm({ languageCode }: Props) {
  const form = useForm<LanguageFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      objective: "",
      subject: "",
      greeting: "",
      introduction: { text: "", maxWords: "" },
      body: [{ text: "", maxWords: "" }],
      goodbye: { text: "", maxWords: "" },
      sample: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "body",
  });

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
        {
          params: {
            language: languageCode,
            type,
          },
        }
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
      toast.error("No friendly text found");
    }
  };

  const handleErase = () => {
    form.reset();
  };

  return (
    <Form {...form}>
      <form className="space-y-4 mt-4">
        <FormField
          name="objective"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Objective" {...field} />
              </FormControl>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => insertFriendly("objective")}
              >
                <Wand2 className="w-4 h-4" /> Friendly
              </Button>
            </FormItem>
          )}
        />

        <FormField
          name="subject"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Subject" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          name="greeting"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Greeting" {...field} />
              </FormControl>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => insertFriendly("greeting")}
              >
                <Wand2 className="w-4 h-4" /> Friendly
              </Button>
            </FormItem>
          )}
        />

        <FormField
          name="introduction.text"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea placeholder="Introduction" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          name="introduction.maxWords"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Max words" type="number" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <label className="font-medium">Body paragraphs</label>
        {fields.map((item, index) => (
          <div key={item.id} className="space-y-2">
            <FormField
              name={`body.${index}.text`}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder={`Paragraph ${index + 1}`}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name={`body.${index}.maxWords`}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="number" placeholder="Max words" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => append({ text: "", maxWords: "" })}
              >
                <Plus className="w-4 h-4" />
              </Button>
              {fields.length > 1 && (
                <Button type="button" onClick={() => remove(index)}>
                  <Minus className="w-4 h-4" />
                </Button>
              )}
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => insertFriendly("body", index)}
              >
                <Wand2 className="w-4 h-4" /> Friendly
              </Button>
            </div>
          </div>
        ))}

        <FormField
          name="goodbye.text"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea placeholder="Goodbye" {...field} />
              </FormControl>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => insertFriendly("goodbye")}
              >
                <Wand2 className="w-4 h-4" /> Friendly
              </Button>
            </FormItem>
          )}
        />

        <FormField
          name="goodbye.maxWords"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="number" placeholder="Max words" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          name="sample"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea placeholder="Sample email" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button type="button" variant="destructive" onClick={handleErase}>
            Erase
          </Button>
          <Button type="button" onClick={() => alert("TODO: Save template")}>
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}
