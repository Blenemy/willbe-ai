import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Company } from "@/types/Company";
import { useCompany } from "@/hooks/useCompany";

const schema = z.object({
  companyName: z.string().min(1, "Required").max(50, "Maximum 50 characters"),
});

const EditCompanyNameDialog = ({
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
      companyName: company.name,
    },
  });

  const { updateCompany } = useCompany({ enableFetch: false });

  const onSubmit = (values: z.infer<typeof schema>) => {
    updateCompany({
      name: values.companyName,
      description: company.description,
      sector: company.sector,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent aria-describedby="comapnyName">
        <DialogHeader>
          <DialogTitle>Company Name</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Company Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your company name"
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

export default EditCompanyNameDialog;
