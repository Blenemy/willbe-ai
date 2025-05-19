import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CalendarDays, Users, Reply } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MeetingsResponsesCard() {
  const meetingRate = 29;
  const responseRate = 29;

  return (
    <Card className="rounded-2xl">
      <CardHeader className="flex justify-between items-start">
        <div>
          <CardTitle>Meetings & responses</CardTitle>
          <p className="text-sm text-muted-foreground">In the last month</p>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <CalendarDays className="w-4 h-4" />
        </Button>
      </CardHeader>

      <CardContent className="grid grid-cols-2 gap-4 text-center">
        <div>
          <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
            <Users className="w-4 h-4" />
            Meeting rate
          </div>
          <div className="text-2xl font-bold">{meetingRate}%</div>
        </div>

        <div>
          <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
            <Reply className="w-4 h-4" />
            Response rate
          </div>
          <div className="text-2xl font-bold">{responseRate}%</div>
        </div>
      </CardContent>
    </Card>
  );
}
