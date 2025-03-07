import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Dispatch, SetStateAction } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useCompanyUsers } from "@/hooks/useCompanyUsers";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "member"]),
  position: z.string().min(1, "Position is required"),
});

interface CreateCompanyUsersProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

type Role = "admin" | "member";

export const CreateCompanyUsers = ({
  open,
  setOpen,
}: CreateCompanyUsersProps) => {
  const { createCompanyUsers } = useCompanyUsers({ enableFetch: true });

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      role: "member" as Role,
      position: "",
    },
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    createCompanyUsers(values);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite User</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="User Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="member">Member</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input placeholder="Position" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Invite</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
