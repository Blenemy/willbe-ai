import { Mail, TrendingUp, Reply, Calendar, Info } from "lucide-react";

const COMMON_SIZE = 24;

const stats = [
  {
    label: "Messages sent",
    value: 94,
    icon: <Mail fill="black" color="white" size={COMMON_SIZE} />,
  },
  {
    label: "Meeting Rate",
    value: "8%",
    icon: <TrendingUp fill="black" color="white" size={COMMON_SIZE} />,
  },
  {
    label: "Response rate",
    value: "2%",
    icon: <Reply fill="black" color="white" size={COMMON_SIZE} />,
  },
  {
    label: "Out-of-office rate",
    value: "8%",
    icon: <Calendar fill="black" color="white" size={COMMON_SIZE} />,
  },
  {
    label: "Bounce rate",
    value: "4%",
    icon: <Info fill="black" color="white" size={COMMON_SIZE} />,
  },
];

export const StatsCards = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
      {stats.map((stat) => (
        <div key={stat.label} className="border rounded-xl p-6 shadow-sm">
          <div className="text-sm text-muted-foreground flex justify-between items-center gap-2">
            <span>{stat.label}</span>
            {stat.icon}
          </div>
          <div className="text-xl font-semibold mt-1">{stat.value}</div>
        </div>
      ))}
    </div>
  );
};
