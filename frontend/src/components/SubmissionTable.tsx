import { CheckCircle, Code2, Loader2, XCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { SubmissionResponse } from "@/lib/validations";
import {
  calculateAverageMemory,
  calculateAverageTime,
  formatRelativeDate,
} from "@/lib/utils";

interface SubmissionTableProps {
  submissions: SubmissionResponse[];
  isLoading: boolean;
}

export default function SubmissionTable({
  submissions,
  isLoading,
}: SubmissionTableProps) {
  if (!submissions.length && !isLoading)
    return (
      <div className="text-muted-foreground flex h-[600px] items-center justify-center">
        <div className="text-center">
          <Code2 className="mx-auto mb-4 h-12 w-12 opacity-50" />
          <p>No submissions yet</p>
        </div>
      </div>
    );
  return (
    <ScrollArea className="h-[600px]">
      {isLoading ? (
        <div className="flex h-full items-center justify-center">
          <Loader2 className="size-6 animate-spin" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Language</TableHead>
              <TableHead>Runtime</TableHead>
              <TableHead>Memory</TableHead>
              <TableHead>Submitted</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((submission) => {
              const avgMemory = calculateAverageMemory(submission.memory);
              const avgTime = calculateAverageTime(submission.time);
              return (
                <TableRow key={submission.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {submission.status === "ACCEPTED" ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span
                        className={
                          submission.status === "ACCEPTED"
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {submission.status}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{submission.language}</TableCell>
                  <TableCell>{avgTime.toFixed(3)} S</TableCell>
                  <TableCell>{avgMemory.toFixed(0)} KB</TableCell>
                  <TableCell>
                    {formatRelativeDate(new Date(submission.createdAt))}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </ScrollArea>
  );
}
