"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { InformationTab } from "./tabs/InformationTab";
import { LeadsTab } from "./tabs/LeadsTab";
import { useParams } from "next/navigation";
import { useAccount } from "@/hooks/useAccountPage";
import { useEffect } from "react";

import { useAuthStore } from "@/store/useAuthStore";

const formSchema = z.object({
  companyTitle: z.string().min(1, "Company title is required"),
  website: z.string().min(1, "Website is required"),
  description: z.string().optional(),
  foundedIn: z.string().optional(),
  headquarters: z.string().optional(),
  employees: z.preprocess(
    (val) => (val === "" ? null : Number(val)),
    z.number().nullable().optional()
  ),
  industry: z.string().optional(),
  linkedin: z.string().optional(),
});

export default function AccountPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const isNew = id === "new-account";
  const { account, updateAccount, createAccount } = useAccount(
    !isNew ? id! : undefined
  );
  const { user } = useAuthStore();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyTitle: "",
      description: "",
      foundedIn: "",
      headquarters: "",
      employees: 0,
      industry: "",
      website: "",
      linkedin: "",
    },
  });
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const payload = {
      ...data,
      employees: data.employees ?? null,
    };

    if (isNew) {
      createAccount(payload);
    } else {
      updateAccount(payload);
    }
  };

  useEffect(() => {
    if (!isNew && account) {
      form.reset({
        companyTitle: account.companyTitle || "",
        description: account.description || "",
        foundedIn: account.foundedIn || "",
        headquarters: account.headquarters || "",
        employees: account.employees || 0,
        industry: account.industry || "",
        website: account.website || "",
        linkedin: account.linkedin || "",
      });
    }
  }, [account, form, isNew]);

  if (!user) {
    return <div>No user was found</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between">
        <h3 className="text-2xl font-semibold">Account page</h3>

      </div>

      <Tabs defaultValue="information">
        <TabsList>
          <TabsTrigger value="information">📋 Information</TabsTrigger>
          <TabsTrigger value="leads">🙋‍♀️ Leads</TabsTrigger>
        </TabsList>

        <TabsContent value="information">
          <InformationTab
            form={form}
            onSubmit={onSubmit}
            logo={account?.logo}
          />
        </TabsContent>

        <TabsContent value="leads">
          <LeadsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
