import { useNavigate } from "react-router-dom";
import { ArrowDown, FileTextIcon, Loader2 } from "lucide-react";
import { problemSchema, type ProblemValues } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Editor } from "@monaco-editor/react";
import {
  BookOpen,
  CheckCircle2,
  Code2,
  Lightbulb,
  Plus,
  Trash2,
} from "lucide-react";
import {
  sampledpData,
  sampleStringProblem,
  type Difficulty,
} from "@/constants";
import LoadingButton from "../LoadingButton";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import { axiosInstance } from "@/lib/axios";
import { useTheme } from "../theme-provider";
import { useProblemStore } from "@/store";
interface CreateProblemFormProps {
  action: "create" | "update";
  problemId?: string;
}
export default function CreateProblemForm({
  action,
  problemId,
}: CreateProblemFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sampleType, setSampleType] = useState("DP");
  const { getProblemById, problem, isProblemLoading } = useProblemStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (action === "update" && problemId) {
      getProblemById(problemId);
    }
  }, [problemId, getProblemById, action]);

  const form = useForm<ProblemValues>({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      title: "",
      description: "",
      difficulty: "EASY",
      testcases: [{ input: "", output: "" }],
      tags: [""],
      constraints: "",
      hints: "",
      editorial: "",
      examples: {
        JAVASCRIPT: { input: "", output: "", explanation: "" },
        PYTHON: { input: "", output: "", explanation: "" },
        JAVA: { input: "", output: "", explanation: "" },
      },
      codeSnippets: {
        JAVASCRIPT: "function solution() {\n  // Write your code here\n}",
        PYTHON: "def solution():\n    # Write your code here\n    pass",
        JAVA: "public class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}",
      },
      referenceSolutions: {
        JAVASCRIPT: "// Add your reference solution here",
        PYTHON: "# Add your reference solution here",
        JAVA: "// Add your reference solution here",
      },
    },
  });
  const { control, setValue } = form;
  useEffect(() => {
    if (action === "update" && problem) {
      form.reset({
        title: problem.title || "",
        description: problem.description || "",
        difficulty: problem.difficulty || "EASY",
        testcases: problem.testcases || [{ input: "", output: "" }],
        tags: problem.tags || [""],
        constraints: problem.constraints || "",
        hints: problem.hints || "",
        editorial: problem.editorial || "",
        examples: problem.examples || {
          JAVASCRIPT: { input: "", output: "", explanation: "" },
          PYTHON: { input: "", output: "", explanation: "" },
          JAVA: { input: "", output: "", explanation: "" },
        },
        codeSnippets: problem.codeSnippets || {
          JAVASCRIPT: "function solution() {\n  // Write your code here\n}",
          PYTHON: "def solution():\n    # Write your code here\n    pass",
          JAVA: "public class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}",
        },
        referenceSolutions: problem.referenceSolutions || {
          JAVASCRIPT: "// Add your reference solution here",
          PYTHON: "# Add your reference solution here",
          JAVA: "// Add your reference solution here",
        },
      });
    }
  }, [problem, action, form.reset, form]);
  const tagFields = useWatch({
    control,
    name: "tags",
  });

  const appendTag = () => {
    setValue("tags", [...(tagFields || []), ""]);
  };
  const removeTag = (index: number) => {
    const updated = tagFields?.filter((_, i) => i !== index) || [];
    setValue("tags", updated);
  };
  // const replaceTags = (index: number, value: string) => {
  //   const updated = [...(tagFields || [])];
  //   updated[index] = value;
  //   setValue("tags", updated);
  // };
  // const {
  //   fields: tagFields,
  //   append: appendTag,
  //   remove: removeTag,
  //   replace: replaceTags,
  // } = useFieldArray<ProblemValues, "tags">({
  //   control: control,
  //   name: "tags",
  // });

  const {
    fields: testCaseFields,
    append: appendTestCase,
    remove: removeTestCase,
    replace: replacetestcases,
  } = useFieldArray({
    control: control,
    name: "testcases",
  });

  async function onSubmit(values: ProblemValues) {
    try {
      setIsLoading(true);
      if (action === "create") {
        const res = await axiosInstance.post("/problem/create-problem", values);
        toast.success(res.data.message || "Problem Created successfully⚡");
      }
      if (action === "update" && problemId) {
        const res = await axiosInstance.put(
          `/problem/update-problem/${problemId}`,
          values,
        );
        toast.success(res.data.message || "Problem Updated successfully⚡");
      }
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }
  const { theme } = useTheme();
  const loadSampleData = () => {
    const sampleData = sampleType === "DP" ? sampledpData : sampleStringProblem;
    replacetestcases(sampleData.testcases.map((tc) => tc));
    form.reset({
      ...sampleData,
      difficulty: sampleData.difficulty as Difficulty,
    });
  };

  if (isProblemLoading) {
    return (
      <div className="flex h-screen w-full justify-center text-center">
        <Loader2 className="mt-9 h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-6 md:p-8">
          <div className="mb-6 flex flex-col items-start justify-between border-b pb-4 md:mb-8 md:flex-row md:items-center">
            <h2 className="card-title flex items-center gap-3 text-2xl md:text-3xl">
              <FileTextIcon className="text-primary h-6 w-6 md:h-8 md:w-8" />
              {action === "create" ? "Create Problem" : "Update Problem"}
            </h2>

            {action === "create" && (
              <div className="mt-4 flex flex-col gap-3 md:mt-0 md:flex-row">
                <div className="join flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSampleType("DP")}
                  >
                    DP Problem
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSampleType("ST")}
                  >
                    String Problem
                  </Button>
                </div>
                <Button
                  variant="secondary"
                  className="gap-2"
                  onClick={loadSampleData}
                >
                  <ArrowDown className="h-4 w-4" />
                  Load Sample
                </Button>
              </div>
            )}
          </div>
          {/* form */}
          <div className="mx-auto max-w-6xl p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel className="text-base font-semibold md:text-lg">
                              Title
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter problem title"
                                className="text-base md:text-lg"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel className="text-base font-semibold md:text-lg">
                              Description
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter problem description"
                                className="min-h-32 text-base md:text-lg"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="difficulty"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold md:text-lg">
                              Difficulty
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="text-base md:text-lg">
                                  <SelectValue placeholder="Select difficulty" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="EASY">Easy</SelectItem>
                                <SelectItem value="MEDIUM">Medium</SelectItem>
                                <SelectItem value="HARD">Hard</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Tags */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Tags
                      </CardTitle>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendTag()}
                      >
                        <Plus className="mr-1 h-4 w-4" /> Add Tag
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {tagFields.map((field, index) => (
                        <div key={field} className="flex items-center gap-2">
                          <FormField
                            control={form.control}
                            name={`tags.${index}`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <Input placeholder="Enter tag" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeTag(index)}
                            disabled={tagFields.length === 1}
                          >
                            <Trash2 className="text-destructive h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    {form.formState.errors.tags &&
                      !Array.isArray(form.formState.errors.tags) && (
                        <FormMessage className="mt-2">
                          {form.formState.errors.tags.message}
                        </FormMessage>
                      )}
                  </CardContent>
                </Card>

                {/* Test Cases */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5" />
                        Test Cases
                      </CardTitle>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          appendTestCase({ input: "", output: "" })
                        }
                      >
                        <Plus className="mr-1 h-4 w-4" /> Add Test Case
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {testCaseFields.map((field, index) => (
                      <Card key={field.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base md:text-lg">
                              Test Case #{index + 1}
                            </CardTitle>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTestCase(index)}
                              disabled={testCaseFields.length === 1}
                            >
                              <Trash2 className="text-destructive mr-1 h-4 w-4" />{" "}
                              Remove
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                            <FormField
                              control={form.control}
                              name={`testcases.${index}.input`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Input</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Enter test case input"
                                      className="min-h-24"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`testcases.${index}.output`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Expected Output</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Enter expected output"
                                      className="min-h-24"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>

                {/* Code Editor Sections */}
                <div className="space-y-8">
                  {(["JAVASCRIPT", "PYTHON", "JAVA"] as const).map(
                    (language) => (
                      <Card key={language}>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Code2 className="h-5 w-5" />
                            {language}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {/* Starter Code */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-base md:text-lg">
                                Starter Code Template
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <FormField
                                control={form.control}
                                name={`codeSnippets.${language}`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <div className="overflow-hidden rounded-md border">
                                        <Editor
                                          height="300px"
                                          language={language.toLowerCase()}
                                          theme={
                                            theme === "dark"
                                              ? "vs-dark"
                                              : "vs-light"
                                          }
                                          value={field.value}
                                          onChange={field.onChange}
                                          options={{
                                            minimap: { enabled: false },
                                            fontSize: 14,
                                            automaticLayout: true,
                                            scrollBeyondLastLine: false,
                                            padding: { top: 16, bottom: 16 },
                                            renderWhitespace: "selection",
                                            fontFamily:
                                              '"Fira Code", "Cascadia Code", Consolas, monospace',
                                            fontLigatures: true,
                                            cursorBlinking: "smooth",
                                            smoothScrolling: true,
                                            contextmenu: true,
                                            renderLineHighlight: "all",
                                            lineHeight: 1.6,
                                            letterSpacing: 0.5,
                                            roundedSelection: true,
                                            scrollbar: {
                                              verticalScrollbarSize: 8,
                                              horizontalScrollbarSize: 8,
                                            },
                                          }}
                                        />
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </CardContent>
                          </Card>

                          {/* Reference Solution */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                                Reference Solution
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <FormField
                                control={form.control}
                                name={`referenceSolutions.${language}`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <div className="overflow-hidden rounded-md border">
                                        <Editor
                                          height="300px"
                                          language={language.toLowerCase()}
                                          theme={
                                            theme === "dark"
                                              ? "vs-dark"
                                              : "vs-light"
                                          }
                                          value={field.value}
                                          onChange={field.onChange}
                                          options={{
                                            minimap: { enabled: false },
                                            fontSize: 14,
                                            automaticLayout: true,
                                            scrollBeyondLastLine: false,
                                            padding: { top: 16, bottom: 16 },
                                            renderWhitespace: "selection",
                                            fontFamily:
                                              '"Fira Code", "Cascadia Code", Consolas, monospace',
                                            fontLigatures: true,
                                            cursorBlinking: "smooth",
                                            smoothScrolling: true,
                                            contextmenu: true,
                                            renderLineHighlight: "all",
                                            lineHeight: 1.6,
                                            letterSpacing: 0.5,
                                            roundedSelection: true,
                                            scrollbar: {
                                              verticalScrollbarSize: 8,
                                              horizontalScrollbarSize: 8,
                                            },
                                          }}
                                        />
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </CardContent>
                          </Card>

                          {/* Examples */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-base md:text-lg">
                                Example
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                                <FormField
                                  control={form.control}
                                  name={`examples.${language}.input`}
                                  render={({ field, fieldState }) => (
                                    <FormItem>
                                      <FormLabel>Input</FormLabel>
                                      <FormControl>
                                        <Textarea
                                          placeholder="Example input"
                                          className="min-h-20"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage>
                                        {fieldState.error?.message}
                                      </FormMessage>
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`examples.${language}.output`}
                                  render={({ field, fieldState }) => (
                                    <FormItem>
                                      <FormLabel>Output</FormLabel>
                                      <FormControl>
                                        <Textarea
                                          placeholder="Example output"
                                          className="min-h-20"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage>
                                        {fieldState.error?.message}
                                      </FormMessage>
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`examples.${language}.explanation`}
                                  render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                      <FormLabel>Explanation</FormLabel>
                                      <FormControl>
                                        <Textarea
                                          placeholder="Explain the example"
                                          className="min-h-24"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </CardContent>
                          </Card>
                        </CardContent>
                      </Card>
                    ),
                  )}
                </div>

                {/* Additional Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-yellow-600" />
                      Additional Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="constraints"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Constraints</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter problem constraints"
                              className="min-h-24"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="hints"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hints (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter hints for solving the problem"
                              className="min-h-24"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="editorial"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Editorial (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter problem editorial/solution explanation"
                              className="min-h-32"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <div className="flex justify-end border-t pt-4">
                  <LoadingButton
                    type="submit"
                    loading={isLoading}
                    disabled={isLoading}
                  >
                    {action === "create" ? "Create Problem" : "Update Problem"}
                  </LoadingButton>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
