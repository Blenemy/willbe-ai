import HeaderClock from "./components/HeaderClock";
import MonthlyGoal from "./components/MonthlyGoal";
import MeetingsResponsesCard from "./components/MeetingsResponsesCard";
import ScenarioPerformanceChart from "./components/ScenarioPerfomanceChart";

export default function HomePage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex gap-4">
        <HeaderClock />
        <MonthlyGoal
          goal={25000}
          achieved={50000}
          pipeline={0}
          isAdmin={true}
        />

        {/* <UserFilterDropdown /> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MeetingsResponsesCard />
        <ScenarioPerformanceChart />
      </div>

      {/* <MeetingsList /> */}
    </div>
  );
}
