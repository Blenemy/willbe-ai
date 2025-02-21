import { Dispatch, SetStateAction, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Product } from "../tabs/ProductsAndServicesTab";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const schema = z.object({
  title: z.string().min(1, "Required").max(15, "Maximum 15 characters"),
  description: z
    .string()
    .min(1, "Required")
    .max(3000, "Maximum 3000 characters"),
});

const EditProductDialog = ({
  open,
  setOpen,
  product,
  setProducts,
}: {
  open: boolean;
  setOpen: (o: boolean) => void;
  product: Product | null;
  setProducts: Dispatch<SetStateAction<Product[]>>;
}) => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        title: product.title,
        description: product.description,
      });
    } else {
      form.reset({
        title: "",
        description: "",
      });
    }
  }, [product, open, form]);

  function onSubmit(values: { title: string; description: string }) {
    setProducts((prevProducts) => {
      const updatedProducts = product
        ? prevProducts.map((p) =>
            p.id === product.id ? { ...p, ...values } : p
          )
        : [...prevProducts, { id: Date.now(), ...values }];

      return updatedProducts;
    });

    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add Product"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={4} />
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

export default EditProductDialog;
