import CalendarHeatmap from "@/components/profile/CalendarHeatmap";
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
  if (isLoading) return null;
  return (
    <section className="mb-4 flex flex-col flex-wrap items-start">
      {/* <div className="mb-2">
        <strong className="ml-3">Heatmap ↓</strong>
      </div> */}
      <Card className="mt-2 w-full cursor-pointer rounded-3xl p-4 2xl:w-fit">
        {/* <CardHeader className="pb-6 text-sm"></CardHeader> */}
        <CardContent className="overflow-auto px-2 pr-3">
          <div className="flex max-w-7xl">
            <span className="text-muted-foreground flex flex-col justify-around py-2 pr-3 text-right text-xs">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </span>
            <div className="w-full min-w-[600px] pr-4 pb-2">
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
