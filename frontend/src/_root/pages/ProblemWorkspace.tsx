import { useExecutionStore, useProblemStore } from "@/store";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import {
  FileText,
  MessageSquare,
  Lightbulb,
  Bookmark,
  Share2,
  Clock,
  ChevronRight,
  Terminal,
  Code2,
  Users,
  ThumbsUp,
  Home,
  Loader2,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/crazxy-ui/badge";
import { Separator } from "@/components/ui/separator";
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
import { getDifficultyColor, getLanguageId } from "@/lib/utils";
import { mockProblem, type Difficulty } from "@/constants";
import SubmissionResults from "@/components/Submission";
import LoadingButton from "@/components/LoadingButton";
import { useTheme } from "@/components/theme-provider";
import { useSubmissionStore } from "@/store/submission-store";
import SubmissionTable from "@/components/SubmissionTable";
type LanguageKey = "JAVASCRIPT" | "PYTHON" | "JAVA";
export default function ProblemWorkspace() {
  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [selectedLanguage, setSelectedLanguage] =
    useState<LanguageKey>("JAVASCRIPT");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { id } = useParams();
  const { getProblemById, problem, isProblemLoading } = useProblemStore();
  const {
    executeCode,
    isExecuting,
    submission: testResults,
  } = useExecutionStore();
  const {
    getSubmissionForProblem,
    isLoading: isSubmissionLoading,
    getSubmissionCountForProblem,
    submissions: submissionResults,
    submissionCount,
  } = useSubmissionStore();
  const { theme } = useTheme();

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
    }, 200);
    return () => clearTimeout(timeout);
  }, [activeTab, id, getSubmissionForProblem]);

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
  // console.log("problem", problem);
  const handleLanguageChange = (value: LanguageKey) => {
    setSelectedLanguage(value);
    setCode(problem.codeSnippets?.[value] || "");
  };
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
    } catch (error) {
      console.error("Error running code:", error);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <ScrollArea className="h-[600px] pr-4">
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
                    <span>{submissionCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    <span>95%</span>
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
          <div className="text-muted-foreground flex h-[600px] items-center justify-center">
            <div className="text-center">
              <MessageSquare className="mx-auto mb-4 h-12 w-12 opacity-50" />
              <p>No discussions yet</p>
            </div>
          </div>
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

  return (
    <div className="bg-background mt-4 min-h-screen px-4">
      {/* Header */}
      <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 border-b backdrop-blur">
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-muted-foreground flex items-center gap-2">
                <Home className="h-4 w-4" />
                <ChevronRight className="h-4 w-4" />
                <span className="text-sm">Problems</span>
                <ChevronRight className="h-4 w-4" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{problem.title}</h1>
                <div className="text-muted-foreground mt-1 flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>
                      Updated {new Date(problem.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <Separator orientation="vertical" className="h-4" />
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{submissionCount} Submissions</span>
                  </div>
                  <Separator orientation="vertical" className="h-4" />
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    <span>95% Success Rate</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={isBookmarked ? "text-yellow-500" : ""}
              >
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
              <Select
                value={selectedLanguage}
                onValueChange={handleLanguageChange}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(problem.codeSnippets || {}).map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-4">
        <ResizablePanelGroup direction="horizontal" className="min-h-[800px]">
          {/* Problem Description Panel */}
          <ResizablePanel defaultSize={45} minSize={30}>
            <Card className="h-full">
              <CardHeader className="pb-3">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger
                      value="description"
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Description
                    </TabsTrigger>
                    <TabsTrigger
                      value="submissions"
                      className="flex items-center gap-2"
                    >
                      <Code2 className="h-4 w-4" />
                      Submissions
                    </TabsTrigger>
                    <TabsTrigger
                      value="discussion"
                      className="flex items-center gap-2"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Discussion
                    </TabsTrigger>
                    <TabsTrigger
                      value="hints"
                      className="flex items-center gap-2"
                    >
                      <Lightbulb className="h-4 w-4" />
                      Hints
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                {renderTabContent()}
              </CardContent>
            </Card>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Code Editor Panel */}
          <ResizablePanel defaultSize={55} minSize={40}>
            <Card className="h-full gap-4">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4" />
                  <CardTitle className="text-lg">Code Editor</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[500px] overflow-hidden rounded-lg border">
                  <Editor
                    height="100%"
                    language={selectedLanguage.toLowerCase()}
                    theme={theme === "dark" ? "vs-dark" : "light"}
                    value={code}
                    onChange={(value) => setCode(value || "")}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: "on",
                      roundedSelection: false,
                      scrollBeyondLastLine: false,
                      readOnly: false,
                      automaticLayout: true,
                      padding: { top: 16, bottom: 16 },
                      renderLineHighlight: "all",
                      selectionHighlight: true,
                      wordBasedSuggestions: true,
                    }}
                  />
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
                    <Button
                      variant="default"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Submit Solution
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
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
