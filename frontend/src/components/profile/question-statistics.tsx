import { Award, Flame, TrendingUp } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/crazxy-ui/badge";

interface QuestionStatisticsProps {
  totalQuestions: number;
  savedQuestions: number;
  userRank: number | undefined;
  streak: number;
}

export default function QuestionStatistics({
  totalQuestions = 500,
  savedQuestions = 175,
  userRank = 42,
  streak = 7,
}: QuestionStatisticsProps) {
  return (
    <Card className="flex gap-0 py-2">
      <CardHeader className="items-center pb-0">
        <CardDescription className="p-0">
          Your learning progress
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 pt-4">
        <div className="grid w-full grid-cols-2 gap-4 text-center">
          <div className="flex flex-col items-center gap-1 rounded-lg border p-3">
            <div className="flex items-center gap-1.5">
              <Award className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium">Rank</span>
            </div>
            <span className="text-xl font-bold">{userRank}</span>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-lg border p-3">
            <div className="flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Streak</span>
            </div>
            <span className="text-xl font-bold">{streak} days</span>
          </div>
        </div>
        <div className="flex w-full flex-col gap-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Questions</span>
            <Badge variant="outline" className="font-normal">
              {savedQuestions} / {totalQuestions}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            <span className="font-medium">
              Keep going! You're making great progress.
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
