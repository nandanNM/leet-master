import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useTheme } from "../theme-provider";

type DataValue = {
  date: string;
  count: number;
};

interface CalendarHeatmapProps {
  startDate: string | Date;
  endDate: string | Date;
  dataValues: DataValue[];
}

export default function CalendarHeatmap({
  startDate,
  endDate,
  dataValues,
}: CalendarHeatmapProps) {
  const startingDate = new Date(startDate);
  const endingDate = new Date(endDate);
  const { theme } = useTheme();
  const daysInMonth =
    Math.ceil(
      (endingDate.getTime() - startingDate.getTime()) / (1000 * 60 * 60 * 24),
    ) + 1;

  const calendarGrid = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(startingDate);
    date.setDate(startingDate.getDate() + i);
    return date.toISOString().slice(0, 10);
  });

  const highestValue = dataValues?.reduce(
    (a, b) => Math.max(a, b.count),
    -Infinity,
  );

  const getIntensity = (activityCount: number): number => {
    return highestValue !== 0 ? Number(activityCount / highestValue) : 0;
  };

  const getColorFromIntensity = (intensity: number): string => {
    const colorCodes = [
      "#FFEEEE",
      "#FFCCCC",
      "#FFAAAA",
      "#FF8888",
      "#FF6666",
      "#FF4444",
    ];
    const colorIndex = Math.min(
      Math.floor(intensity * colorCodes.length),
      colorCodes.length - 1,
    );
    return colorCodes[colorIndex];
  };

  return (
    <div
      className="grid grid-flow-col gap-[2px]"
      style={{ gridTemplateRows: "repeat(7, minmax(0, 1fr))" }}
    >
      {calendarGrid.map((day) => {
        const activityCount =
          dataValues.find((item) => item.date === day)?.count || 0;
        const intensity = getIntensity(activityCount);
        const color = getColorFromIntensity(intensity);
        return (
          <Link
            key={day}
            to={``}
            className={cn(
              "h-4 w-4 cursor-pointer rounded",
              activityCount === 0 ? "bg-muted" : "",
            )}
            title={`${activityCount} submissions on ${day}`}
            style={{
              backgroundColor:
                activityCount === 0
                  ? theme === "dark"
                    ? "#ffffff10"
                    : "#e4e4e4"
                  : color,
            }}
          />
        );
      })}
    </div>
  );
}
