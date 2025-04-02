"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Minus, Wand2 } from "lucide-react";
import { useParams } from "next/navigation";
import {
  useMessageStructureForm,
  LANGUAGES,
} from "@/hooks/useMessageStructureForm";

export default function MessageStructureEditor() {
  const { id } = useParams();
  const {
    form,
    fields,
    append,
    remove,
    createStructure,
    insertFriendly,
    eraseStructure,
    handleLanguageChange,
    currentLang,
  } = useMessageStructureForm(id as string);

  const emailType = form.watch("emailType");
  const isFirstEmail = emailType === "first_email";

  return (
    <Form {...form}>
      <div className="max-w-4xl mx-auto p-6 flex flex-col gap-6">
        <h1 className="text-2xl font-bold">Create Message Structure</h1>

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
                <Input placeholder="Email Type (e.g. first_email)" {...field} />
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

        <Button type="button" onClick={() => createStructure()}>
          Create structure
        </Button>

        <Tabs value={currentLang} onValueChange={handleLanguageChange}>
          <TabsList className="w-full justify-start overflow-x-auto">
            {LANGUAGES.map((lang) => (
              <TabsTrigger key={lang} value={lang}>
                {lang}
              </TabsTrigger>
            ))}
          </TabsList>

          {LANGUAGES.map((lang) => (
            <TabsContent key={lang} value={lang} className="mt-4 space-y-4">
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
                      onClick={() =>
                        insertFriendly("objective", undefined, lang)
                      }
                    >
                      <Wand2 className="w-4 h-4" /> Friendly
                    </Button>
                  </FormItem>
                )}
              />

              {isFirstEmail && (
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
              )}

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
                      onClick={() =>
                        insertFriendly("greeting", undefined, lang)
                      }
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
                      <Input type="number" placeholder="Max words" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <label className="font-medium">Body Paragraphs</label>
              {fields.map((item, index) => (
                <div key={item.id} className="space-y-1">
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
                          <Input
                            type="number"
                            placeholder="Max words"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => append({ text: "", maxWords: "" })}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => remove(index)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => insertFriendly("body", index, lang)}
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
                      onClick={() => insertFriendly("goodbye", undefined, lang)}
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
                <Button
                  type="button"
                  variant="destructive"
                  onClick={eraseStructure}
                >
                  Erase structure for {lang}
                </Button>
                <Button
                  type="button"
                  disabled={!form.formState.isValid}
                  onClick={() => alert("Save logic here")}
                >
                  Save email structure for {lang}
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Form>
  );
}
