"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
  {
    id: 3,
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice@example.com",
    phone: "1111111111",
    role: "CFO",
  },
  {
    id: 4,
    firstName: "Bob",
    lastName: "Brown",
    email: "bob@example.com",
    phone: "2222222222",
    role: "COO",
  },
  {
    id: 5,
    firstName: "Charlie",
    lastName: "Davis",
    email: "charlie@example.com",
    phone: "3333333333",
    role: "CMO",
  },
  {
    id: 6,
    firstName: "Diana",
    lastName: "Evans",
    email: "diana@example.com",
    phone: "4444444444",
    role: "CIO",
  },
  {
    id: 7,
    firstName: "Frank",
    lastName: "Green",
    email: "frank@example.com",
    phone: "5555555555",
    role: "Engineer",
  },
  {
    id: 8,
    firstName: "Grace",
    lastName: "Hill",
    email: "grace@example.com",
    phone: "6666666666",
    role: "Designer",
  },
  {
    id: 9,
    firstName: "Hank",
    lastName: "Iverson",
    email: "hank@example.com",
    phone: "7777777777",
    role: "Product Manager",
  },
  {
    id: 10,
    firstName: "Ivy",
    lastName: "Jones",
    email: "ivy@example.com",
    phone: "8888888888",
    role: "HR",
  },
  {
    id: 11,
    firstName: "Jack",
    lastName: "King",
    email: "jack@example.com",
    phone: "9999999999",
    role: "Sales",
  },
];
export default function AccountPage() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Submitted data:", data);
  };

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
          <InformationTab form={form} onSubmit={onSubmit} />
        </TabsContent>

        <TabsContent value="leads">
          <LeadsTab leads={leads} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
