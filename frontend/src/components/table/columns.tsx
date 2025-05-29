import type { ProblemWithSolvedStatus } from "@/lib/validations";
import { type ColumnDef, type FilterFn } from "@tanstack/react-table";
import { Badge } from "../ui/crazxy-ui/badge";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import RowActions from "./row-action";
import { Checkbox } from "../ui/checkbox";
const difficultyFilterFn: FilterFn<ProblemWithSolvedStatus> = (
  row,
  columnId,
  filterValue: string[],
) => {
  if (!filterValue?.length) return true;
  const difficulty = row.getValue(columnId) as string;
  return filterValue.includes(difficulty);
};
const multiColumnFilterFn: FilterFn<ProblemWithSolvedStatus> = (
  row,
  columnId,
  filterValue,
) => {
  const searchableRowContent = `${row.original.title}`.toLowerCase();
  const searchTerm = (filterValue ?? "").toLowerCase();
  console.log(columnId);
  return searchableRowContent.includes(searchTerm);
};

const tagFilterFn: FilterFn<ProblemWithSolvedStatus> = (
  row,
  columnId,
  filterValue: string[],
) => {
  if (!filterValue?.length) return true;
  const tags = row.original.tags || [];
  console.log(columnId);
  return filterValue.some((tag) => tags.includes(tag));
};

export const columns: ColumnDef<ProblemWithSolvedStatus>[] = [
  {
    id: "solved",
    header: "Solved",
    cell: ({ row }) => {
      const isSolved = row.original.isSolved;
      return (
        <Checkbox
          checked={isSolved}
          aria-label="Problem solved status"
          className="ml-2 size-5 rounded-full data-[state=checked]:border-emerald-500 data-[state=checked]:bg-emerald-500"
        />
      );
    },
    size: 80,
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "Title",
    accessorKey: "title",
    cell: ({ row }) => {
      const isSolved = row.original.isSolved;
      return (
        <Link
          to={`/problems/${row.original.id}`}
          className={`relative font-semibold ${isSolved ? "text-muted-foreground" : "hover:underline"} after:bg-muted-foreground after:absolute after:top-1/2 after:left-0 after:h-px after:w-full after:origin-bottom after:-translate-y-1/2 after:scale-x-0 after:transition-transform after:ease-in-out ${isSolved ? "after:scale-x-100" : ""}`}
        >
          {row.getValue("title")}
        </Link>
      );
    },
    size: 250,
    filterFn: multiColumnFilterFn,
    enableHiding: false,
  },
  {
    header: "Tags",
    accessorKey: "tags",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.tags?.map((tag, idx) => (
          <Badge
            key={idx}
            variant="outlineOrange"
            className="text-xs font-bold"
          >
            {tag}
          </Badge>
        ))}
      </div>
    ),
    size: 200,
    filterFn: tagFilterFn,
  },
  {
    header: "Difficulty",
    accessorKey: "difficulty",
    cell: ({ row }) => (
      <Badge
        className={cn(
          "text-xs font-semibold text-white",
          row.getValue("difficulty") === "EASY" &&
            "bg-green-500 hover:bg-green-600",
          row.getValue("difficulty") === "MEDIUM" &&
            "bg-yellow-500 hover:bg-yellow-600",
          row.getValue("difficulty") === "HARD" &&
            "bg-red-500 hover:bg-red-600",
        )}
      >
        {row.getValue("difficulty")}
      </Badge>
    ),
    size: 120,
    filterFn: difficultyFilterFn,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <RowActions row={row} />,
    size: 200,
    enableHiding: false,
    enableSorting: false,
  },
];
