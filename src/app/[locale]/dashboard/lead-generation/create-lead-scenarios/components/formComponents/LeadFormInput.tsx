import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LeadScenariosFormType } from "@/schemas/leadScenariosFiltersSchema";
import { UseFormReturn } from "react-hook-form";

interface FormInputAccordionProps {
  form: UseFormReturn<LeadScenariosFormType>;
  name: keyof LeadScenariosFormType;
  placeholder: string;
}

const LeadFormInput = ({
  form,
  name,
  placeholder,
}: FormInputAccordionProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input
              placeholder={placeholder}
              className="mb-3"
              {...field}
              value={typeof field.value === "string" ? field.value : ""}
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default LeadFormInput;
