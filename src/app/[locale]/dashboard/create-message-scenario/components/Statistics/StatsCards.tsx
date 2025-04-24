import { Mail, TrendingUp, Reply, Calendar, Info } from "lucide-react";
import { useScenarioStatistics } from "@/hooks/useScenarioStatistics";
import { useParams } from "next/navigation";

const COMMON_SIZE = 20;

export const StatsCards = () => {
  const params = useParams();
  const scenarioId = params?.id as string;
  const { data, isLoading, error } = useScenarioStatistics(scenarioId);

  if (isLoading) return <div>Loading stats...</div>;
  if (error || !data) return <div>Error loading statistics.</div>;

  const stats = [
    {
      label: "Messages sent",
      value: data.totalSent,
      icon: <Mail size={COMMON_SIZE} className="text-blue-600" />,
      valueClass: "text-blue-600",
    },
    {
      label: "Meeting rate",
      value: `${data.meetingRate}%`,
      icon: <TrendingUp size={COMMON_SIZE} className="text-green-600" />,
      valueClass: "text-green-600",
    },
    {
      label: "Response rate",
      value: `${data.responseRate}%`,
      icon: <Reply size={COMMON_SIZE} className="text-yellow-500" />,
      valueClass: "text-yellow-500",
    },
    {
      label: "Out-of-office rate",
      value: `${data.outOfOfficeRate}%`,
      icon: <Calendar size={COMMON_SIZE} className="text-orange-500" />,
      valueClass: "text-orange-500",
    },
    {
      label: "Bounce rate",
      value: `${data.bounceRate}%`,
      icon: <Info size={COMMON_SIZE} className="text-red-600" />,
      valueClass: "text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
      {stats.map((stat) => (
        <div key={stat.label} className="border rounded-xl p-6 shadow-sm">
          <div className="text-sm text-muted-foreground flex justify-between items-center gap-2">
            <span>{stat.label}</span>
            {stat.icon}
          </div>
          <div className={`text-2xl font-semibold mt-1 ${stat.valueClass}`}>
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  );
};
