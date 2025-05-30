"use client";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import {
  atomOneDark,
  a11yLight,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useTheme } from "../theme-provider";

interface CodeBlockProps {
  code: string;
  language: string;
}

const CodeBlock = ({ code, language }: CodeBlockProps) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const lines = code.split("\n");
  const displayCode = isExpanded ? code : lines.slice(0, 6).join("\n");

  return (
    <div className="relative">
      <SyntaxHighlighter
        language={language.toLowerCase()}
        style={theme === "dark" ? atomOneDark : a11yLight}
        customStyle={{
          padding: "1rem",
          borderRadius: "0.5rem",
          background:
            theme === "dark" ? "rgba(0, 0, 0, 0.4)" : "rgba(0, 0, 0, 0.1)",
          margin: 0,
        }}
      >
        {displayCode}
      </SyntaxHighlighter>

      {lines.length > 6 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute right-2 bottom-2 flex items-center gap-1 rounded bg-blue-500/20 px-2 py-1 text-xs text-blue-400 transition-colors hover:bg-blue-500/30"
        >
          {isExpanded ? (
            <>
              Show Less <ChevronUp className="h-3 w-3" />
            </>
          ) : (
            <>
              Show More <ChevronDown className="h-3 w-3" />
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default CodeBlock;
