import { useExecutionStore, useProblemStore } from "@/store";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FileText,
  MessageSquare,
  Lightbulb,
  Code2,
  Users,
  ThumbsUp,
  Loader2,
  Play,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/crazxy-ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { formatNumber, getDifficultyColor, getLanguageId } from "@/lib/utils";
import { mockProblem, type Difficulty } from "@/constants";
import SubmissionResults from "@/components/Submission";
import LoadingButton from "@/components/LoadingButton";
import { useSubmissionStore } from "@/store";
import SubmissionTable from "@/components/SubmissionTable";
import MonocoEditor from "@/components/editor/Editor";
import { useCodeEditorStore } from "@/store";
import ProblemHeader from "@/components/ProblemHeader";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useDiscussionStore } from "@/store/discussion-store";
import CodeDiscussion from "@/components/CodeDiscussion";

export default function ProblemWorkspace() {
  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { id } = useParams();
  const { getProblemById, problem, isProblemLoading } = useProblemStore();
  const {
    isExecuting,
    submission: testResults,
    runCode: executeCode,
    submitCode,
    isSubmitting,
  } = useExecutionStore();
  const {
    getSubmissionForProblem,
    isLoading: isSubmissionLoading,
    getSubmissionCountForProblem,
    submissionsForProblem: submissionResults,
    submissionCount,
  } = useSubmissionStore();
  const { language: selectedLanguage, clearProblemCode } = useCodeEditorStore();
  const {
    discussions,
    getAllDiscussions,
    isLoading: isDiscussionLoading,
  } = useDiscussionStore();
  useEffect(() => {
    if (!id) return;
    getProblemById(id as string);
    getSubmissionCountForProblem(id as string);
  }, [id, getProblemById, getSubmissionCountForProblem]);
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (activeTab === "submissions" && id) {
        getSubmissionForProblem(id);
      }
      if (activeTab === "discussion" && id) {
        getAllDiscussions(id);
      }
    }, 200);
    return () => clearTimeout(timeout);
  }, [activeTab, id, getSubmissionForProblem, getAllDiscussions]);

  useEffect(() => {
    if (problem) setCode(problem.codeSnippets?.[selectedLanguage] || "");
  }, [selectedLanguage, problem]);

  if (isProblemLoading || !problem) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }
  if (!problem && !isProblemLoading)
    return (
      <div className="text-primary flex w-full items-center justify-center text-2xl">
        Problem not found
      </div>
    );
  const handleRunCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const language_id = getLanguageId(selectedLanguage);
    const stdin = problem?.testcases.map((tc) => tc.input);
    const expected_outputs = problem?.testcases.map((tc) => tc.output);

    try {
      await executeCode({
        expected_outputs,
        stdin,
        source_code: code,
        language_id: language_id || "",
        problemId: id as string,
      });
      clearProblemCode(problem.id);
    } catch (error) {
      console.error("Error running code:", error);
    }
  };
  const handleSubmitCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const language_id = getLanguageId(selectedLanguage);
    const stdin = problem?.testcases.map((tc) => tc.input);
    const expected_outputs = problem?.testcases.map((tc) => tc.output);
    try {
      await submitCode({
        expected_outputs,
        stdin,
        source_code: code,
        language_id: language_id || "",
        problemId: id as string,
      });
      clearProblemCode(problem.id);
    } catch (error) {
      console.error("Error running code:", error);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <ScrollArea className="h-[620px] pr-4">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Badge
                  className={getDifficultyColor(
                    problem.difficulty as Difficulty,
                  )}
                >
                  {problem.difficulty}
                </Badge>
                <div className="text-muted-foreground flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>
                      {formatNumber(submissionCount?.submissionCount || 0)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{submissionCount?.successRate}%</span>
                  </div>
                </div>
              </div>

              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-base leading-relaxed">
                  {problem.description}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Examples</h3>
                {Object.entries(problem.examples).map(([lang, example]) => (
                  <Card key={lang} className="bg-muted/50">
                    <CardContent className="space-y-3 p-4">
                      <div>
                        <div className="mb-1 text-sm font-medium text-blue-600 dark:text-blue-400">
                          Input:
                        </div>
                        <code className="bg-background rounded px-2 py-1 font-mono text-sm">
                          {example.input}
                        </code>
                      </div>
                      <div>
                        <div className="mb-1 text-sm font-medium text-green-600 dark:text-green-400">
                          Output:
                        </div>
                        <code className="bg-background rounded px-2 py-1 font-mono text-sm">
                          {example.output}
                        </code>
                      </div>
                      {example.explanation && (
                        <div>
                          <div className="mb-1 text-sm font-medium text-purple-600 dark:text-purple-400">
                            Explanation:
                          </div>
                          <p className="text-muted-foreground text-sm">
                            {example.explanation}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Constraints</h3>
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <code className="font-mono text-sm">
                      {problem.constraints}
                    </code>
                  </CardContent>
                </Card>
              </div>
            </div>
          </ScrollArea>
        );
      case "submissions":
        return (
          <SubmissionTable
            submissions={submissionResults}
            isLoading={isSubmissionLoading}
          />
        );
      case "discussion":
        return (
          <CodeDiscussion
            messages={discussions}
            isLoading={isDiscussionLoading}
            problemId={problem.id}
          />
        );
      case "hints":
        return problem.hints ? (
          <ScrollArea className="h-[600px]">
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Lightbulb className="mt-0.5 h-5 w-5 text-yellow-500" />
                  <p className="text-sm">{problem.hints}</p>
                </div>
              </CardContent>
            </Card>
          </ScrollArea>
        ) : (
          <div className="text-muted-foreground flex h-[600px] items-center justify-center">
            <div className="text-center">
              <Lightbulb className="mx-auto mb-4 h-12 w-12 text-yellow-500 opacity-50" />
              <p>No hints yet</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  if (isMobile) {
    return (
      <div className="bg-background mt-4 min-h-screen px-4">
        <p className="text-center">Mobile view not supported</p>
      </div>
    );
  }

  return (
    <div className="bg-background mt-4 min-h-screen px-4">
      {/* Header */}
      <ProblemHeader
        problem={problem}
        submissionCount={submissionCount?.submissionCount}
        successRate={submissionCount?.successRate}
      />
      <div className="mx-auto p-4">
        <ResizablePanelGroup direction={"horizontal"} className="min-h-[550px]">
          {/* Problem Description Panel */}
          <ResizablePanel defaultSize={45} minSize={35}>
            <Card className="h-full">
              <CardHeader className="pb-3">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger
                      value="description"
                      className="flex cursor-pointer items-center gap-2 text-xs"
                    >
                      <FileText className="h-4 w-4" />
                      Description
                    </TabsTrigger>
                    <TabsTrigger
                      value="submissions"
                      className="flex cursor-pointer items-center gap-2 text-xs"
                    >
                      <Code2 className="h-4 w-4" />
                      Submissions
                    </TabsTrigger>
                    <TabsTrigger
                      value="discussion"
                      className="flex cursor-pointer items-center gap-2 text-xs"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Discussion
                    </TabsTrigger>
                    <TabsTrigger
                      value="hints"
                      className="flex cursor-pointer items-center gap-2 text-xs"
                    >
                      <Lightbulb className="h-4 w-4" />
                      Hints
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                {renderTabContent()}
              </CardContent>
            </Card>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Code Editor Panel */}
          <ResizablePanel defaultSize={55} minSize={40}>
            <div className="h-full gap-4">
              <div className="h-[550px] overflow-hidden rounded-lg">
                <MonocoEditor problem={problem} />
              </div>
              <div className="bg-muted/50 border-t p-4">
                <div className="flex items-center justify-between">
                  <LoadingButton
                    onClick={handleRunCode}
                    loading={isExecuting}
                    variant="accent"
                    className="flex items-center gap-2"
                  >
                    <Play className="h-4 w-4" />
                    Run Code
                  </LoadingButton>
                  <LoadingButton
                    loading={isSubmitting}
                    onClick={handleSubmitCode}
                    variant="default"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Submit Solution
                  </LoadingButton>
                </div>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>

        {/* Test Results */}
        {testResults ? (
          <SubmissionResults submission={testResults} />
        ) : (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Test Cases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Input</TableHead>
                    <TableHead>Expected Output</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockProblem.testcases.map((testCase, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono text-sm">
                        {testCase.input}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {testCase.output}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
