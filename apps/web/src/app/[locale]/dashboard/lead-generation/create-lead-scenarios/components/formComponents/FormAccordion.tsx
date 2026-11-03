import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FormAccordionProps {
  children: React.ReactNode;
  label: string;
  defaultOpen?: boolean;
  className?: string;
}

const FormAccordion = ({
  children,
  label,
  className,
  defaultOpen,
}: FormAccordionProps) => {
  return (
    <Accordion
      type="single"
      collapsible
      className={className}
      defaultValue={defaultOpen ? "name" : undefined}
    >
      <AccordionItem value="name" className="bg-slate-200">
        <AccordionTrigger className="p-3">{label}</AccordionTrigger>
        <AccordionContent className="p-3">{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default FormAccordion;
