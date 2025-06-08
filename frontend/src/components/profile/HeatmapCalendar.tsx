import CalendarHeatmap from "@/components/profile/CalendarHeatmap";
import type { SubmissionHeatmapEntry } from "@/types";

import { Card, CardContent } from "../ui/card";
import QuestionStatistics from "./question-statistics";
import type { UserRankForSolvedProblems } from "@/lib/validations";
import { useProblemStore } from "@/store";
interface HeatmapCalendarProps {
  data: SubmissionHeatmapEntry[];
  userRank: UserRankForSolvedProblems | null;
  isLoading: boolean;
}

export default function HeatmapCalendar({
  data,
  userRank,
  isLoading,
}: HeatmapCalendarProps) {
  const totalContributions = data.reduce((sum, item) => sum + item.count, 0);
  console.log(data);
  const { problems } = useProblemStore();
  if (isLoading) return null;
  return (
    <section className="mb-4 w-full gap-2 xl:flex">
      <Card className="mt-2 cursor-pointer rounded-3xl p-4">
        <CardContent className="overflow-auto">
          <div className="mb-4">
            <h3 className="text-foreground mb-1 text-sm font-medium">
              Activity Overview
            </h3>
            <p className="text-muted-foreground text-xs">
              {totalContributions} contributions in the selected period
            </p>
          </div>
          <div className="flex max-w-7xl">
            <span className="text-muted-foreground flex flex-col justify-around py-2 pr-3 text-right text-xs">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </span>
            <div className="pr-4 pb-2">
              <CalendarHeatmap
                startDate={new Date("2025-01-01")}
                endDate={new Date("2025-12-3")}
                dataValues={data}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <QuestionStatistics
        totalQuestions={problems.length}
        solvedQuestions={userRank?.solvedCount || 0}
        userRank={userRank?.rank || undefined}
        streak={data.length}
      />
    </section>
  );
}
