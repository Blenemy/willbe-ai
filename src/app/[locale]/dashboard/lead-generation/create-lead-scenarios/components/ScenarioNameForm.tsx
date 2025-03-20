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
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const leadScenariosName = z.object({
  name: z.string(),
});

const ScenarioNameForm = () => {
  const form = useForm({
    resolver: zodResolver(leadScenariosName),
    defaultValues: {
      name: "",
    },
  });

  const searchParams = useSearchParams();
  const scenarioName = searchParams.get("scenarioName");
  const scenarioId = searchParams.get("scenarioId");

  const { postLeadScenarious } = useLeadScenarios({
    enableFetch: false,
    scenarioId,
  });

  function onSubmit(values: z.infer<typeof leadScenariosName>) {
    postLeadScenarious({ name: values.name });
  }

  useEffect(() => {
    if (scenarioName) {
      form.setValue("name", scenarioName);
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
                Scenario name
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Scenario name"
                  className="mb-3"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {!scenarioName && (
          <Button type="submit" className="max-w-fit">
            Create a scenario
          </Button>
        )}
      </form>
    </Form>
  );
};

export default ScenarioNameForm;
