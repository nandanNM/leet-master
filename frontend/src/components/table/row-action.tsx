import { Bookmark, PencilIcon, TrashIcon } from "lucide-react";
import { Button } from "../ui/button";
import type { Row } from "@tanstack/react-table";
import type { Problem } from "@/lib/validations";

export default function RowActions({
  row,
  authUser,
  onDeleteProblem,
  onAddToPlaylist,
}: {
  row: Row<Problem>;
  authUser?: { id: string; role: string } | null;
  onDeleteProblem: (id: string) => void;
  onAddToPlaylist: (problemId: string) => void;
}) {
  return (
    <div className="flex flex-col items-start gap-2 md:flex-row md:items-center">
      {authUser?.role === "ADMIN" && (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="destructive"
            className=""
            onClick={() => onDeleteProblem(row.original.id)}
          >
            <TrashIcon className="h-4 w-4 text-white" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="bg-yellow-500 duration-200 ease-in hover:bg-yellow-600"
          >
            <PencilIcon className="h-4 w-4 text-white" />
          </Button>
        </div>
      )}
      <Button
        size="sm"
        variant="outline"
        className="hover:bg-primary gap-2 duration-300 ease-in hover:text-white"
        onClick={() => onAddToPlaylist(row.original.id)}
      >
        <Bookmark className="h-4 w-4" />
      </Button>
    </div>
  );
}
