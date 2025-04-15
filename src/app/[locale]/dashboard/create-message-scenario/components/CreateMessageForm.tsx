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
import { useCreateMessageScenario } from "@/hooks/useMessageScenarios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const createMessageScenarioForm = z.object({
  scenario_title: z.string().min(1, "Title is required"),
});

interface Props {
  defaultTitle?: string;
  id?: string;
}

const CreateMessageForm = ({ defaultTitle, id }: Props) => {
  const form = useForm({
    resolver: zodResolver(createMessageScenarioForm),
    defaultValues: {
      scenario_title: "",
    },
  });

  const { mutate } = useCreateMessageScenario();

  const onSubmit = (values: { scenario_title: string }) => {
    mutate({ name: values.scenario_title });
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
                Scenario title
              </FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input
                    placeholder="Enter scenario title"
                    className="flex-1"
                    {...field}
                  />
                </FormControl>
                <Button type="submit" className="whitespace-nowrap">
                  {id ? "Update a scneario" : "Create a scneario"}
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
