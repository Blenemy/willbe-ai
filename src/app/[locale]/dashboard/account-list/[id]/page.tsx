"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { InformationTab } from "./tabs/InformationTab";
import { LeadsTab } from "./tabs/LeadsTab";

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

const defaultValues = {
  companyTitle: "Telivust",
  description:
    "Telivust is a DevOps consulting company dedicated to empowering businesses to accelerate their software development and IT operations...",
  foundedIn: "2004",
  headquarters: "PL",
  employees: "2",
  industry: "IT Services and IT Consulting",
  website: "https://telivust.com",
  linkedin: "https://www.linkedin.com/company/telivust/",
};

const leads = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "1234567890",
    role: "CTO",
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@example.com",
    phone: "9876543210",
    role: "CEO",
  },
];

export default function AccountPage() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between">
        <h3>Account page</h3>

        <p>This account is connected to HubSpot</p>
      </div>
      <Tabs defaultValue="information">
        <TabsList>
          <TabsTrigger value="information">Information</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
        </TabsList>

        <TabsContent value="information">
          <InformationTab form={form} />
        </TabsContent>

        <TabsContent value="leads">
          <LeadsTab leads={leads} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
