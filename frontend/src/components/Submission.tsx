import {
  CheckCircle,
  Clock,
  MemoryStick,
  ThumbsUp,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/crazxy-ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import type { SubmissionWithTestCases } from "@/lib/validations";
import { cn } from "@/lib/utils";

interface SubmissionResultsProps {
  submission: SubmissionWithTestCases;
}

export default function SubmissionResults({
  submission,
}: SubmissionResultsProps) {
  // Parse stringified arrays
  const memoryArr = JSON.parse(submission.memory || "[]");
  const timeArr = JSON.parse(submission.time || "[]");

  // Calculate averages
  const avgMemory =
    memoryArr
      .map((m: string) => Number.parseFloat(m)) // remove ' KB' using parseFloat
      .reduce((a: number, b: number) => a + b, 0) / memoryArr.length;

  const avgTime =
    timeArr
      .map((t: string) => Number.parseFloat(t)) // remove ' s' using parseFloat
      .reduce((a: number, b: number) => a + b, 0) / timeArr.length;

  const passedTests = submission.testCases.filter((tc) => tc.passed).length;
  const totalTests = submission.testCases.length;
  const successRate = (passedTests / totalTests) * 100;

  const getStatusColor = (status: string) => {
    return status === "ACCEPTED"
      ? ""
      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
  };

  return (
    <div className="mt-6 space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-muted-foreground mb-2 text-sm font-medium">
              Status
            </div>
            <Badge
              variant={
                submission.status === "ACCEPTED" ? "outlineGreen" : "outline"
              }
              className={cn(getStatusColor(submission.status), "")}
            >
              {submission.status}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-muted-foreground mb-2 flex items-center gap-2 text-sm font-medium">
              <ThumbsUp className="h-4 w-4" />
              Success Rate
            </div>
            <div className="text-2xl font-bold">{successRate.toFixed(1)}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-muted-foreground mb-2 flex items-center gap-2 text-sm font-medium">
              <Clock className="h-4 w-4" />
              Avg. Runtime
            </div>
            <div className="text-2xl font-bold">{avgTime.toFixed(3)} s</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-muted-foreground mb-2 flex items-center gap-2 text-sm font-medium">
              <MemoryStick className="h-4 w-4" />
              Avg. Memory
            </div>
            <div className="text-2xl font-bold">{avgMemory.toFixed(0)} KB</div>
          </CardContent>
        </Card>
      </div>

      {/* Test Cases Results */}
      <Card className="gap-2 py-5">
        <CardHeader>
          <CardTitle>Test Cases Results</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Expected Output</TableHead>
                <TableHead>Your Output</TableHead>
                <TableHead>Memory</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submission.testCases.map((testCase) => (
                <TableRow key={testCase.testCase}>
                  <TableCell>
                    {testCase.passed ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="font-medium">Passed</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-600">
                        <XCircle className="h-4 w-4" />
                        <span className="font-medium">Failed</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {testCase.expected}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    <span
                      className={
                        testCase.passed ? "text-green-600" : "text-red-600"
                      }
                    >
                      {testCase.stdout || "null"}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">{testCase.memory}</TableCell>
                  <TableCell className="text-sm">{testCase.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
