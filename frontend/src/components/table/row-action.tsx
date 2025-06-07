import { Bookmark, Loader2, PencilIcon, TrashIcon } from "lucide-react";
import { Button } from "../ui/button";
import type { Row } from "@tanstack/react-table";
import type { ProblemWithSolvedStatus } from "@/lib/validations";
import { useActions, useAuthStore } from "@/store";
import { usePlaylistDialog } from "@/store";
import { Link } from "react-router-dom";

export default function RowActions({
  row,
}: {
  row: Row<ProblemWithSolvedStatus>;
}) {
  const { authUser } = useAuthStore();
  const { onDeleteProblem, isDeletingProblem } = useActions();
  const { openDialog } = usePlaylistDialog();
  const handleDeleteProblem = (id: string) => {
    onDeleteProblem(id);
  };
  return (
    <div className="flex flex-col items-start gap-2 md:flex-row md:items-center">
      {authUser?.role === "ADMIN" && (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="destructive"
            className=""
            onClick={() => handleDeleteProblem(row.original.id)}
          >
            {isDeletingProblem ? (
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            ) : (
              <TrashIcon className="h-4 w-4 text-white" />
            )}
          </Button>
          <Link to={`/update-problem/${row.original.id}`}>
            <Button
              size="sm"
              variant="secondary"
              className="bg-yellow-500 duration-200 ease-in hover:bg-yellow-600"
            >
              <PencilIcon className="h-4 w-4 text-white" />
            </Button>
          </Link>
        </div>
      )}
      <Button
        size="sm"
        variant="outline"
        className="hover:bg-primary gap-2 duration-300 ease-in hover:text-white"
        onClick={() => openDialog(row.original.id)}
      >
        <Bookmark className="h-4 w-4" />
      </Button>
    </div>
  );
}
