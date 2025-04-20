"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  useCreateMessageScenario,
  useUpdateMessageScenario,
} from "@/hooks/useMessageScenarios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTranslations } from "next-intl";

const CreateMessageForm = ({
  defaultTitle,
  id,
}: {
  defaultTitle?: string;
  id?: string;
}) => {
  const t = useTranslations("messageScenario");
  const schema = z.object({
    scenario_title: z.string().min(1, t("validation.titleRequired")),
  });

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { scenario_title: "" },
  });

  const { mutate: createMutation } = useCreateMessageScenario();
  const { mutate: updateMutation } = useUpdateMessageScenario();

  const onSubmit = (values: { scenario_title: string }) => {
    if (id) {
      updateMutation({ name: values.scenario_title, id });
    } else {
      createMutation({ name: values.scenario_title });
    }
  };

  useEffect(() => {
    if (defaultTitle) {
      form.reset({ scenario_title: defaultTitle });
    }
  }, [defaultTitle, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="scenario_title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-foreground">
                {t("form.titleLabel")}
              </FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input
                    placeholder={t("form.titlePlaceholder")}
                    className="flex-1"
                    {...field}
                  />
                </FormControl>
                <Button type="submit" className="whitespace-nowrap">
                  {id ? t("form.updateBtn") : t("form.createBtn")}
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default CreateMessageForm;
