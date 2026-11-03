"use client";

import { MessageEntry } from "@/hooks/useMessageCampaignEntries";
import { Mail, ListChecks } from "lucide-react";
import LinkedinIcon from "@/assets/linkedin.svg";
import Image from "next/image";

interface Props {
  entries: MessageEntry[];
}

export const ScenarioCalendarStats = ({ entries }: Props) => {
  const emailTypes = ["first_email", "follow_up_email"];
  const linkedinTypes = [
    "linkedin_connection",
    "linkedin_message",
    "linkedin_follow_up",
  ];

  const emailCount = entries.filter((e) => emailTypes.includes(e.type)).length;
  const linkedinCount = entries.filter((e) =>
    linkedinTypes.includes(e.type)
  ).length;
  const totalCount = entries.length;

  return (
    <div className="grid grid-cols-3 gap-4 mt-6">
      <StatCard
        title="Steps"
        value={totalCount}
        icon={<ListChecks className="text-green-500 w-5 h-5" />}
        valueClass="text-green-600"
      />
      <StatCard
        title="Emails"
        value={emailCount}
        icon={<Mail className="text-yellow-500 w-5 h-5" />}
        valueClass="text-yellow-500"
      />
      <StatCard
        title="LinkedIn"
        value={linkedinCount}
        icon={
          <Image
            src={LinkedinIcon}
            alt="linkedin"
            className="w-5 h-5"
            width={20}
            height={20}
          />
        }
        valueClass="text-blue-800"
      />
    </div>
  );
};

const StatCard = ({
  title,
  value,
  icon,
  valueClass,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  valueClass?: string;
}) => (
  <div className="border rounded-lg p-4 flex justify-between items-center">
    <div>
      <div className="text-sm text-gray-500">{title}</div>
      <div className={`text-2xl font-semibold ${valueClass}`}>{value}</div>
    </div>
    <div>{icon}</div>
  </div>
);
