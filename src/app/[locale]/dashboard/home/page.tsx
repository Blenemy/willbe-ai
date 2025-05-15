import HeaderClock from "./components/HeaderClock";
import MonthlyGoal from "./components/MonthlyGoal";
import MeetingsResponsesCard from "./components/MeetingsResponsesCard";
import ScenarioPerformanceChart from "./components/ScenarioPerfomanceChart";
import MeetingsList from "./components/MeetingsList";

export default function HomePage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex gap-4">
        <HeaderClock />
        <MonthlyGoal
          goal={35000}
          achieved={50000}
          pipeline={70000}
          isAdmin={true}
        />

        {/* <UserFilterDropdown /> */}
      </div>

      <div className="grid md:grid-cols-[2fr_3fr] gap-4">
        <div className="grid grid-rows-[auto_1fr] gap-4">
          <MeetingsResponsesCard />
          <ScenarioPerformanceChart />
        </div>

        <div className="h-full">
          <MeetingsList />
        </div>
      </div>
    </div>
  );
}
