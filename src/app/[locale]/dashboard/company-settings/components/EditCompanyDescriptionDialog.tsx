import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Company } from "@/types/Company";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCompany } from "@/hooks/useCompany";
import { useEffect } from "react";

const schema = z.object({
  companyDescription: z
    .string()
    .min(1, "Required")
    .max(3000, "Maximum 3000 characters"),
});

const EditCompanyDescriptionDialog = ({
  open,
  setOpen,
  company,
}: {
  open: boolean;
  setOpen: (o: boolean) => void;
  company: Company;
}) => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      companyDescription: company.description || "",
    },
  });

  const { updateCompany } = useCompany({ enableFetch: false });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    updateCompany({
      name: company.name,
      description: values.companyDescription,
      sector: company.sector,
    });
    setOpen(false);
  };

  useEffect(() => {
    if (open) {
      form.reset({
        companyDescription: company?.name || "",
      });
      form.clearErrors();
    }
  }, [open, company, form]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Company Description</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="companyDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-foreground">
                    Company Description
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your company description"
                      {...field}
                      type="text"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCompanyDescriptionDialog;
