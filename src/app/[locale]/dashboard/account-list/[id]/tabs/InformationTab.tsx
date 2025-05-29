/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { User } from "lucide-react";

interface Props {
  form: UseFormReturn<any>;
  onSubmit: (values: any) => void;
  logo: string | undefined;
}

export const InformationTab = ({ form, onSubmit, logo }: Props) => {
  return (
    <Form {...form}>
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="col-span-2 flex items-center gap-4">
          {logo ? (
            <Image
              src={logo}
              alt="Company logo"
              width={60}
              height={60}
              className="rounded-full border"
            />
          ) : (
            <div className="w-[60px] h-[60px] flex items-center justify-center rounded-full border bg-muted">
              <User className="w-6 h-6 text-muted-foreground" />
            </div>
          )}
          <FormField
            control={form.control}
            name="companyTitle"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-foreground">Company title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="foundedIn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Founded in</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="headquarters"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Headquarters</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="employees"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Employees</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="industry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Industry</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">Website</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="linkedin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LinkedIn</FormLabel>
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
            <FormItem className="col-span-2">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className="w-full border rounded-md p-2 min-h-[460px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="max-w-fit min-w-24 bg-[#030A27]">
          Save
        </Button>
      </form>
    </Form>
  );
};
