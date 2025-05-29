import CalendarHeatmap from "react-calendar-heatmap";
import type { SubmissionHeatmapEntry } from "@/types";
import "react-calendar-heatmap/dist/styles.css";
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
      <Card className="w-full cursor-pointer rounded-3xl 2xl:w-fit">
        {/* <CardHeader className="pb-6 text-sm"></CardHeader> */}
        <CardContent>
          <CalendarHeatmap
            startDate={new Date("2025-01-01")}
            endDate={new Date("2025-12-31")}
            values={data}
            classForValue={(value) => {
              if (!value || value.count === 0) return "color-empty";
              if (value.count >= 5) return "color-github-5";
              return `color-github-${value.count}`;
            }}
            showWeekdayLabels={false}
          />
        </CardContent>
      </Card>
    </section>
  );
}
