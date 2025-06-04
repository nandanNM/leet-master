import { MessageSquare, Send } from "lucide-react";
import { useRef, useState } from "react";
import UserAvatar from "./UserAvatar";
import { formatMessage, formatRelativeDate } from "@/lib/utils";
import { Separator } from "./ui/separator";
import { useDiscussionStore } from "@/store/discussion-store";
import type { DiscussionWithUser } from "@/lib/validations";
import LoadingButton from "./LoadingButton";
import { Textarea } from "./ui/textarea";

interface CodeDiscussionProps {
  messages: DiscussionWithUser[];
  problemId: string;

  isLoading: boolean;
}
export default function CodeDiscussion({
  messages,
  problemId,

  isLoading: isDiscussionLoading,
}: CodeDiscussionProps) {
  const { createDiscussion, isLoading } = useDiscussionStore();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // const scrollToBottom = () => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // };

  // useEffect(() => {
  //   scrollToBottom();
  // }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    await createDiscussion(input.trim(), problemId);
    setInput("");
  };
  if (isDiscussionLoading)
    return <div className="mt-2 text-center">Loading...</div>;
  return (
    <div className="flex h-[620px] flex-1 flex-col p-0">
      <div className="flex-1 space-y-6 overflow-y-auto p-6">
        {messages.length === 0 && (
          <div className="py-12 text-center">
            <MessageSquare className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              Start the Discussion
            </h3>
            <p className="text-gray-600">
              Ask questions, share code, or discuss algorithms
            </p>
          </div>
        )}

        {messages.map((message: DiscussionWithUser) => (
          <div key={message.id} className="flex space-x-4">
            <UserAvatar
              className="h-8 w-8 flex-shrink-0"
              avatarUrl={message.user.avatar}
            />

            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center space-x-2">
                <span className="font-medium text-gray-900">
                  {message.user.name}
                </span>

                <span className="text-xs text-gray-500">
                  {formatRelativeDate(new Date(message.createdAt))}
                </span>
              </div>

              <div className="prose prose-sm max-w-none leading-relaxed text-gray-800">
                <div
                  dangerouslySetInnerHTML={{
                    __html: formatMessage(message.message || ""),
                  }}
                />
              </div>
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      <Separator />

      <div className="p-6">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
          <Textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Ask a question, share code, or discuss algorithms..."
          />
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              Use ``` for code blocks, `code` for inline code
            </div>
            <LoadingButton
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex items-center space-x-2"
              loading={isLoading}
            >
              <span>Send</span>
              <Send className="h-4 w-4" />
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
}
