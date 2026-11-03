import HeaderClock from "./components/HeaderClock";
import MeetingsResponsesCard from "./components/MeetingsResponsesCard";
import ScenarioPerformanceChart from "./components/ScenarioPerfomanceChart";
import MeetingsList from "./components/MeetingsList";

export default function HomePage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex gap-4 min-h-[260px]">
        <div className="w-1/2">
          <HeaderClock />
        </div>
        <div className="w-1/2">
          <MeetingsResponsesCard />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="h-full">
          <ScenarioPerformanceChart />
        </div>

        <div className="h-full">
          <MeetingsList />
        </div>
      </div>
    </div>
  );
}
