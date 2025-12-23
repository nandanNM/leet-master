import Editor from "@monaco-editor/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { MessageSquare, RotateCcwIcon, TypeIcon } from "lucide-react";
import { defineMonacoThemes, LANGUAGE_CONFIG } from "@/constants";
import { useCodeEditorStore, useReviewStore } from "@/store";
import type { Problem } from "@/lib/validations";
import { CodeReviewSheet } from "../code-review-sheet";
import { Button } from "../ui/button";
interface MonocoEditorProps {
  problem: Problem;
}
export default function MonocoEditor({ problem }: MonocoEditorProps) {
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const { language, theme, fontSize, editor, setFontSize, setEditor, getCode } =
    useCodeEditorStore();
  const { getCodeReview } = useReviewStore();
  const defaultCode = problem.codeSnippets[language];
  useEffect(() => {
    if (!editor) return;
    const savedCode = localStorage.getItem(
      `editor-code-${problem.id}-${language}`,
    );
    const codeToSet = savedCode || defaultCode;
    editor.setValue(codeToSet);
  }, [language, editor, problem.id, defaultCode]);

  useEffect(() => {
    const savedFontSize = localStorage.getItem("editor-font-size");
    if (savedFontSize) setFontSize(parseInt(savedFontSize));
  }, [setFontSize]);

  const handleRefresh = () => {
    if (editor) {
      editor.setValue(defaultCode);
      localStorage.removeItem(`editor-code-${problem.id}-${language}`);
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      localStorage.setItem(`editor-code-${problem.id}-${language}`, value);
    }
  };

  const handleGetAIReview = async () => {
    const code = getCode();
    if (!code || code === problem.codeSnippets[language]) {
      alert("Please write some code before requesting a review!");
      return;
    }
    getCodeReview({
      code,
      language,
      problemTitle: problem.title,
    });
    setIsSheetOpen(true);
  };

  const handleFontSizeChange = (newSize: number) => {
    const size = Math.min(Math.max(newSize, 12), 24);
    setFontSize(size);
    localStorage.setItem("editor-font-size", size.toString());
  };
  return (
    <div className="relative">
      <div className="border-border bg-background/90 relative rounded-xl border p-6 backdrop-blur">
        {/* Header */}
        <CodeReviewSheet isOpen={isSheetOpen} onOpenChange={setIsSheetOpen} />
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-muted ring-border flex h-8 w-8 items-center justify-center rounded-lg ring-1">
              <img
                src={"/" + language.toLocaleLowerCase() + ".png"}
                alt="Logo"
                className="rounded"
                width={24}
                height={24}
              />
            </div>
            <div>
              <h2 className="text-foreground text-sm font-medium">
                Code Editor
              </h2>
              <p className="text-muted-foreground text-xs">
                Write and execute your code
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Font Size Slider */}

            <Button
              onClick={handleGetAIReview}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Get AI Review </span>
            </Button>
            <div className="bg-muted ring-border flex items-center gap-3 rounded-lg px-3 py-2 ring-1">
              <TypeIcon className="text-muted-foreground size-4" />
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={fontSize}
                  onChange={(e) =>
                    handleFontSizeChange(parseInt(e.target.value))
                  }
                  className="bg-secondary h-1 w-20 cursor-pointer rounded-lg"
                />
                <span className="text-muted-foreground min-w-[2rem] text-center text-sm font-medium">
                  {fontSize}
                </span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="bg-muted ring-border hover:bg-accent cursor-pointer rounded-lg p-2 ring-1 transition-colors"
              aria-label="Reset to default code"
            >
              <RotateCcwIcon className="text-muted-foreground size-4" />
            </motion.button>
          </div>
        </div>

        {/* Editor  */}
        <div className="group ring-border relative overflow-hidden rounded-lg ring-1">
          <Editor
            height="600px"
            language={LANGUAGE_CONFIG[language].monacoLanguage}
            onChange={handleEditorChange}
            theme={theme}
            beforeMount={defineMonacoThemes}
            onMount={(editor) => setEditor(editor)}
            options={{
              minimap: { enabled: false },
              fontSize,
              automaticLayout: true,
              scrollBeyondLastLine: false,
              padding: { top: 16, bottom: 16 },
              renderWhitespace: "selection",
              fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
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
      </div>
    </div>
  );
}
