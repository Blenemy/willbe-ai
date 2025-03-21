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
import { useAccountScenarios } from "@/hooks/useAccountScenarios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const accountScenariosName = z.object({
  account_name: z.string(),
});

const AccountNameForm = () => {
  const form = useForm({
    resolver: zodResolver(accountScenariosName),
    defaultValues: {
      account_name: "",
    },
  });

  const searchParams = useSearchParams();
  const accountName = searchParams.get("accountName");
  const accountId = searchParams.get("accountId");

  const { createAccountScenario, updateAccountScenario, accountScenarioById } =
    useAccountScenarios({
      enableFetch: false,
      accountId,
    });

  function onSubmit(values: z.infer<typeof accountScenariosName>) {
    if (accountId) {
      updateAccountScenario({
        accountId,
        payload: { name: values.account_name },
      });
    } else {
      createAccountScenario({ name: values.account_name });
    }
  }

  useEffect(() => {
    if (accountId && accountScenarioById?.name) {
      form.setValue("account_name", accountScenarioById.name);
    }
  }, [accountScenarioById, form, accountId]);

  return (
    <Form {...form}>
      <form
        className="mb-6 flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="account_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-foreground">
                Account name
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

        <Button type="submit" className="max-w-fit">
          {accountName ? "Update" : "Create"} an account scenario
        </Button>
      </form>
    </Form>
  );
};

export default AccountNameForm;
