import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { Bot } from "lucide-react";
import { useEffect, useRef } from "react";
import { useCodeEditorStore, useReviewStore } from "@/store";
interface CodeReviewSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CodeReviewSheet({
  isOpen,
  onOpenChange,
}: CodeReviewSheetProps) {
  // const [initialReviewDone, setInitialReviewDone] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { getCodeReview, isLoading, review } = useReviewStore();
  const { getCode, language } = useCodeEditorStore();
  useEffect(() => {
    getCodeReview({
      code: getCode(),
      language,
      problemTitle: "Add too numbers",
    });
  }, [getCode, getCodeReview, language]);
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="flex h-full w-full flex-col sm:max-w-2xl">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-blue-600">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <span>AI Code Review</span>
          </SheetTitle>
          <SheetDescription>
            Get instant feedback on your code with AI-powered analysis and
            suggestions.
          </SheetDescription>
          <Separator />
        </SheetHeader>

        {/* Messages */}
        <ScrollArea className="flex-1 px-1" ref={scrollAreaRef}>
          <div className="space-y-4 py-4">
            {review?.review && !isLoading && (
              <div className="py-8 text-center text-gray-500">
                <Bot className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                <p>AI is analyzing your code...</p>
              </div>
            )}

            {/* {messages.map((message, index) => renderMessage(message, index))} */}
            <p>{review?.review}</p>

            {isLoading && (
              <div className="flex items-start space-x-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-blue-600">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="rounded-lg bg-gray-50 p-3">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Chat Input */}
        {/* {initialReviewDone && (
          <div className="flex-shrink-0 border-t pt-4">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Ask follow-up questions about your code..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        )} */}
      </SheetContent>
    </Sheet>
  );
}
