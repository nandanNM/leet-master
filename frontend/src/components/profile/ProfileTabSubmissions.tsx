import {
  Calendar,
  ChevronRight,
  Code,
  ListVideo,
  Loader2,
  Album,
  Trash,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import CodeBlock from "@/components/editor/CodeBlock";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/crazxy-ui/badge";
import { usePlaylistStore, useSubmissionStore } from "@/store";
import { capitalizeWord, formatRelativeDate } from "@/lib/utils";
import LoadingButton from "../LoadingButton";
import EditPlaylistDialog from "../EditPlaylistDialog";

const TABS = [
  {
    id: "executions",
    label: "Code Executions",
    icon: ListVideo,
  },
  {
    id: "playlist",
    label: "My Playlists",
    icon: Album,
  },
];

export default function ProfileTabSubmissions() {
  const [activeTab, setActiveTab] = useState<"executions" | "playlist">(
    "executions",
  );

  const { id: userId } = useParams();
  const {
    getAllSubmissions,
    isLoading: isLoadingExecutions,
    submissions,
  } = useSubmissionStore();
  const {
    getAllPlaylistsForUser,
    isLoadingUserPlaylists,
    userPlaylists,
    deletePlaylist,
    isLoading: isDeletingPlaylist,
  } = usePlaylistStore();

  useEffect(() => {
    if (activeTab === "executions") getAllSubmissions();
  }, [userId, getAllSubmissions, activeTab]);
  useEffect(() => {
    if (activeTab === "playlist") getAllPlaylistsForUser();
  }, [userId, getAllPlaylistsForUser, activeTab]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-3">
      <Card className="overflow-hidden rounded-3xl shadow-lg">
        {/* Tabs */}
        <div className="border-b">
          <div className="flex space-x-1 p-4">
            {TABS.map((tab) => (
              <Button
                key={tab.id}
                variant="ghost"
                onClick={() =>
                  setActiveTab(tab.id as "executions" | "playlist")
                }
                className={`group relative flex items-center gap-2 overflow-hidden rounded-lg px-6 py-2.5 transition-all duration-200 ${
                  activeTab === tab.id
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="bg-primary/10 absolute inset-0 rounded-lg"
                    transition={{
                      type: "spring",
                      bounce: 0.2,
                      duration: 0.6,
                    }}
                  />
                )}
                <tab.icon className="relative z-10 h-4 w-4" />
                <span className="relative z-10 text-sm font-medium">
                  {tab.label}
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="p-6"
          >
            {/* Executions Tab */}
            {activeTab === "executions" && (
              <div className="space-y-6">
                {!submissions.length ? (
                  <div className="flex items-center justify-center">
                    <h1 className="text-2xl font-semibold">
                      No submissions found
                    </h1>
                  </div>
                ) : (
                  submissions?.map((execution) => (
                    <Card
                      key={execution.id}
                      className="group hover:border-primary/50 hover:shadow-primary/10 overflow-hidden transition-all hover:shadow-md"
                    >
                      <div className="bg-muted/50 flex items-center justify-between rounded-t-xl border-b p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="bg-primary/20 absolute inset-0 rounded-lg blur transition-opacity group-hover:opacity-30" />
                            <img
                              src={`/${execution.language.toLowerCase()}.png`}
                              alt={`${execution.language} logo`}
                              className="relative z-10 rounded"
                              width={40}
                              height={40}
                            />
                          </div>

                          <div className="flex flex-col items-center gap-2">
                            <span className="rounded-lg px-3 py-1 text-sm">
                              {execution.language}
                            </span>
                            <Badge
                              variant={
                                execution.status === "ACCEPTED"
                                  ? "outlineGreen"
                                  : "outlineOrange"
                              }
                            >
                              {execution.status === "ACCEPTED"
                                ? "accepted"
                                : "rejected"}
                            </Badge>
                          </div>
                          <div className="text-muted-foreground flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {formatRelativeDate(
                                new Date(execution.createdAt),
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                      <CardContent className="bg-muted/20 p-4">
                        <CodeBlock
                          code={execution.sourceCode}
                          language={execution.language}
                        />
                        {execution.status && (
                          <Card className="mt-4">
                            <CardContent className="flex items-center justify-between p-2 px-6">
                              <div className="h-full">
                                <h4 className="text-muted-foreground mb-2 text-sm font-medium">
                                  Output :
                                </h4>
                                <pre
                                  className={`text-sm ${
                                    execution.status === "ACCEPTED"
                                      ? "text-green-600 dark:text-green-400"
                                      : "text-destructive"
                                  }`}
                                >
                                  {execution.stdout || execution.compileOutput}
                                </pre>
                              </div>
                              {/* <div>TODO</div> */}
                            </CardContent>
                          </Card>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}

                {isLoadingExecutions ? (
                  <div className="py-12 text-center">
                    <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  submissions.length === 0 && (
                    <div className="py-12 text-center">
                      <Code className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                      <h3 className="text-muted-foreground mb-2 text-lg font-medium">
                        No code executions yet
                      </h3>
                      <p className="text-muted-foreground">
                        Start coding to see your execution history!
                      </p>
                    </div>
                  )
                )}

                {/* {executionStatus === "CanLoadMore" && (
                  <div className="mt-8 flex justify-center">
                    <Button
                      variant="outline"
                      onClick={handleLoadMore}
                      className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20"
                    >
                      Load More
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )} */}
              </div>
            )}

            {/* playlist Tab */}
            {activeTab === "playlist" && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {userPlaylists?.map((playlist) => (
                  <div key={playlist.id} className="group relative">
                    <Card className="hover:border-muted-foreground/30 h-full gap-2 overflow-hidden py-2 transition-all duration-300 group-hover:scale-[1.02]">
                      <CardContent className="p-3">
                        <div className="mb-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="bg-primary/20 absolute inset-0 rounded-lg blur transition-opacity group-hover:opacity-30" />
                              <div className="bg-primary/10 relative z-10 flex h-10 w-10 items-center justify-center rounded-lg">
                                <Code className="text-primary h-5 w-5" />
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {formatRelativeDate(
                                  new Date(playlist.createdAt),
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="absolute top-6 right-6 z-10 flex gap-2">
                            <EditPlaylistDialog
                              playlistId={playlist.id}
                              name={playlist.name}
                              description={playlist.description}
                            />
                            <LoadingButton
                              onClick={() => deletePlaylist(playlist.id)}
                              loading={isDeletingPlaylist}
                              variant="destructive"
                              size="icon"
                              className="p-1"
                            >
                              <Trash className="h-5 w-5 text-white" />
                            </LoadingButton>
                          </div>
                        </div>
                        <Link to={`/playlist/${playlist.id}`}>
                          <h2 className="text-foreground group-hover:text-primary mb-3 line-clamp-1 text-xl font-semibold">
                            {capitalizeWord(playlist.name)}
                          </h2>
                          <div className="text-muted-foreground flex items-center justify-between text-sm">
                            <span className="line-clamp-1">
                              {capitalizeWord(playlist.description || "")}
                            </span>
                            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </div>
                        </Link>
                      </CardContent>
                    </Card>
                  </div>
                ))}

                {isLoadingUserPlaylists && (
                  <div className="py-12 text-center">
                    <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin" />
                  </div>
                )}

                {(!userPlaylists || userPlaylists.length === 0) && (
                  <div className="col-span-full py-12 text-center">
                    <Album className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                    <h3 className="text-muted-foreground mb-2 text-lg font-medium">
                      No playlist yet
                    </h3>
                    <p className="text-muted-foreground">
                      Start exploring and create your playlist to find useful!
                    </p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </Card>
    </div>
  );
}
