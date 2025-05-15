"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { InformationTab } from "./tabs/InformationTab";
import { LeadsTab } from "./tabs/LeadsTab";
import { useParams } from "next/navigation";
import { useAccount } from "@/hooks/useAccountPage";
import { useEffect, useState } from "react";

import isConnectedHubspot from "@/assets/hubspot_orange.svg";
import isNotConnectedHubspot from "@/assets/hubspot_grey.svg";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { ConfirmationModal } from "../../profile/hubspot-settings/components/ConfirmationModal";

const formSchema = z.object({
  companyTitle: z.string(),
  description: z.string(),
  foundedIn: z.string(),
  headquarters: z.string(),
  employees: z.string(),
  industry: z.string(),
  website: z.string().url(),
  linkedin: z.string().url(),
});

export default function AccountPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const isNew = id === "new-account";
  const { account, updateAccount } = useAccount(!isNew ? id! : undefined);
  const { user } = useAuthStore();
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyTitle: "",
      description: "",
      foundedIn: "",
      headquarters: "",
      employees: "",
      industry: "",
      website: "",
      linkedin: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    updateAccount(data);
  };

  useEffect(() => {
    if (!isNew && account) {
      form.reset({
        companyTitle: account.companyTitle || "",
        description: account.description || "",
        foundedIn: account.foundedIn || "",
        headquarters: account.headquarters || "",
        employees: account.employees || "",
        industry: account.industry || "",
        website: account.website || "",
        linkedin: account.linkedin || "",
      });
    }
  }, [account, form, isNew]);

  const isAccountConnectedToHubspot = account?.isConnectedToHubspot;

  if (!user) {
    return <div>No user was found</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between">
        <h3>Account page</h3>

        <div className="flex gap-2">
          <div className="flex gap-3 items-center bg-[#F8F9FB] px-2 rounded-md">
            <Image
              width={20}
              height={20}
              alt="hubspot_icon"
              src={
                isAccountConnectedToHubspot
                  ? isConnectedHubspot
                  : isNotConnectedHubspot
              }
            />

            <p>
              This account is {isAccountConnectedToHubspot ? "" : "not"}{" "}
              connected to HubSpot
            </p>
          </div>

          <Button
            type="submit"
            className="max-w-fit min-w-24 h-8 bg-[#030A27]"
            onClick={() => setShowConfirm(true)}
          >
            Sync
          </Button>
        </div>
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

      <ConfirmationModal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        companyId={user.companyId}
      />
    </div>
  );
}
