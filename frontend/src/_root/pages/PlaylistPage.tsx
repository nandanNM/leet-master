import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/crazxy-ui/badge";
import { Trash2, Calendar, Loader2 } from "lucide-react";
import { usePlaylistStore } from "@/store";
import { useParams } from "react-router-dom";
import { formatDate } from "date-fns";
import { getDifficultyColor } from "@/lib/utils";
import LoadingButton from "@/components/LoadingButton";
const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};
export default function PlaylistPage() {
  const { id: playlistId } = useParams();
  const {
    getPlaylistDetails,
    currentPlaylist: playlistData,
    isLoading,
    removeProblemFromPlaylist,
    isRemovingPoblem,
  } = usePlaylistStore();
  useEffect(() => {
    getPlaylistDetails(playlistId || "");
  }, [playlistId, getPlaylistDetails]);
  if (!playlistId) return null;
  if (isLoading || !playlistData) {
    return (
      <div className="mt-10 w-full text-center">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }
  const handleRemoveProblem = (problemId: string) => {
    removeProblemFromPlaylist(playlistId, [...problemId]);
  };
  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Playlist Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold">
                {playlistData.name}
              </CardTitle>
              <CardDescription className="text-base">
                {playlistData.description}
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-sm">
              {playlistData.problems.length} Problem
              {playlistData.problems.length !== 1 ? "s" : ""}
            </Badge>
          </div>

          <div className="text-muted-foreground flex flex-wrap gap-4 pt-4 text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>
                Created:{" "}
                {formatDate(new Date(playlistData.createdAt), "yyyy-MM-dd")}
              </span>
            </div>
          </div>
        </CardHeader>
      </Card>
      {/* Problems Table */}
      <Card>
        <CardHeader>
          <CardTitle>Problems</CardTitle>
          <CardDescription>
            Manage the coding problems in your playlist
          </CardDescription>
        </CardHeader>
        <CardContent>
          {playlistData.problems.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center">
              <div className="text-lg font-medium">
                No problems in this playlist
              </div>
              <div className="text-sm">Add some problems to get started!</div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Problem</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead className="w-[400px]">Description</TableHead>
                    <TableHead>Test Cases</TableHead>
                    <TableHead>Added</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {playlistData.problems.map((problemItem) => (
                    <TableRow
                      key={problemItem.id}
                      className="hover:bg-muted/50"
                    >
                      <TableCell>
                        <div className="font-medium">
                          {problemItem.problem.title}
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={getDifficultyColor(
                            problemItem.problem.difficulty,
                          )}
                        >
                          {problemItem.problem.difficulty}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {problemItem.problem.tags
                            .slice(0, 3)
                            .map((tag, index) => (
                              <Badge
                                key={index}
                                variant="purple"
                                className="text-[10px]"
                              >
                                {tag.toLocaleLowerCase()}
                              </Badge>
                            ))}
                          {problemItem.problem.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{problemItem.problem.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="text-sm">
                          {truncateText(problemItem.problem.description, 80)}
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline">
                          {problemItem.problem.testcases?.length || 0} cases
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="text-muted-foreground text-sm">
                          {formatDate(problemItem.createdAt, "yyyy-MM-dd")}
                        </div>
                      </TableCell>

                      <TableCell>
                        <LoadingButton
                          loading={isRemovingPoblem}
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveProblem(problemItem.id)}
                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </LoadingButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
