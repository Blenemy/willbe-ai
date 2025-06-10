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
import { useLeadScenarios } from "@/hooks/useLeadScenarious";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const leadScenariosName = z.object({
  name: z.string(),
});

const ScenarioNameForm = () => {
  const t = useTranslations("leadProfileForm");

  const form = useForm({
    resolver: zodResolver(leadScenariosName),
    defaultValues: {
      name: "",
    },
  });

  const searchParams = useSearchParams();
  const scenarioName = searchParams.get("scenarioName");
  const scenarioId = searchParams.get("scenarioId");

  const { postLeadScenarious, updateLeadScenario } = useLeadScenarios({
    enableFetch: false,
    scenarioId,
  });

  function onSubmit(values: z.infer<typeof leadScenariosName>) {
    if (scenarioId) {
      updateLeadScenario({ name: values.name, id: scenarioId });
    } else {
      postLeadScenarious({ name: values.name });
    }
  }

  useEffect(() => {
    if (scenarioName) {
      form.setValue("name", scenarioName);
    } else {
      form.reset({ name: "" });
    }
  }, [scenarioName, form]);

  return (
    <Form {...form}>
      <form
        className="mb-6 flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-foreground">
                {t("label")}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t("placeholder")}
                  className="mb-3"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="max-w-fit">
          {scenarioId ? t("update") : t("create")}
        </Button>
      </form>
    </Form>
  );
};

export default ScenarioNameForm;
