import HeaderClock from "./components/HeaderClock";
import QuarterlyGoalCard from "./components/QuarterlyGoalCard";
import MeetingsResponsesCard from "./components/MeetingsResponsesCard";
import ScenarioPerformanceChart from "./components/ScenarioPerfomanceChart";
import MeetingsList from "./components/MeetingsList";

export default function HomePage() {
  return (
    <div className="grid gap-4 md:h-[calc(100svh-6rem)] md:min-h-[680px] md:grid-cols-2 md:grid-rows-[auto_auto_minmax(0,1fr)]">
      <div className="min-h-[180px] md:col-start-1 md:row-start-1">
        <HeaderClock />
      </div>
      <div className="md:col-start-2 md:row-start-1">
        <QuarterlyGoalCard />
      </div>
      <div className="md:col-start-1 md:row-start-2">
        <MeetingsResponsesCard />
      </div>
      <div className="min-h-[320px] md:col-start-1 md:row-start-3 md:min-h-0">
        <ScenarioPerformanceChart />
      </div>
      <div className="min-h-[480px] md:col-start-2 md:row-span-2 md:row-start-2 md:min-h-0">
        <MeetingsList />
      </div>
    </div>
  );
}
