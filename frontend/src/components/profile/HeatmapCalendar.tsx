import CalendarHeatmap from "@/components/CalendarHeatmap";
import type { SubmissionHeatmapEntry } from "@/types";

import { Card, CardContent } from "../ui/card";
interface HeatmapCalendarProps {
  data: SubmissionHeatmapEntry[];
  isLoading: boolean;
}

export default function HeatmapCalendar({
  data,
  isLoading,
}: HeatmapCalendarProps) {
  console.log("data", data, isLoading);
  return (
    <section className="mb-4 flex flex-col flex-wrap items-start">
      <div className="mb-2">
        <strong className="ml-3">Heatmap ↓</strong>
      </div>
      <Card className="w-full rounded-3xl px-4 py-4">
        <CardContent className="max-w-6xl overflow-auto">
          <div className="flex w-full justify-between gap-2">
            <span className="text-muted-foreground flex flex-col justify-around py-2 pr-2 text-right text-xs">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </span>
            <div className="w-full min-w-[600px] pr-4">
              <CalendarHeatmap
                startDate={new Date("2025-01-01")}
                endDate={new Date("2025-12-31")}
                dataValues={data}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
