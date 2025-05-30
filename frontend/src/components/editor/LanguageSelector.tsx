"use client";

import { useCodeEditorStore } from "@/store/code-cditor-store";
import { motion } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";
import useMounted from "@/hooks/useMounted";
import { LANGUAGE_CONFIG } from "@/constants";
import type { LanguageKey } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function LanguageSelector() {
  const mounted = useMounted();
  const { language, setLanguage } = useCodeEditorStore();
  const currentLanguageObj = LANGUAGE_CONFIG[language];

  const handleLanguageSelect = (lang: LanguageKey) => {
    setLanguage(lang);
  };

  if (!mounted) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="group border-border bg-popover hover:border-muted hover:text-foreground relative flex items-center gap-3 rounded-lg border px-4 py-2.5 transition-all"
        >
          <motion.div
            className="from-primary/10 to-secondary/5 absolute inset-0 rounded-lg bg-gradient-to-r opacity-0 transition-opacity group-hover:opacity-100"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-hidden="true"
          />

          <div className="bg-muted size-6 rounded-md p-0.5 transition-transform group-hover:scale-110">
            <img
              src={currentLanguageObj.logoPath || "/placeholder.svg"}
              alt="programming language logo"
              width={24}
              height={24}
              className="relative z-10 h-full w-full object-contain"
            />
          </div>

          <span className="text-muted-foreground group-hover:text-foreground min-w-[80px] text-left">
            {currentLanguageObj.label}
          </span>

          <ChevronDown className="text-muted-foreground group-hover:text-foreground size-4 transition-all duration-300" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="border-border bg-popover/95 w-64 rounded-xl border py-2 shadow-2xl backdrop-blur-xl"
        align="start"
      >
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <DropdownMenuLabel className="text-muted-foreground px-3 text-xs font-medium">
            Select Language
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="border-muted" />

          <div className="max-h-[280px] overflow-x-hidden overflow-y-auto">
            {Object.values(LANGUAGE_CONFIG).map((lang, index) => (
              <DropdownMenuItem
                key={lang.id}
                className={`group hover:bg-muted focus:bg-muted relative mx-2 flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 ${
                  language === lang.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground"
                }`}
                onClick={() =>
                  handleLanguageSelect(lang.id.toUpperCase() as LanguageKey)
                }
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex w-full items-center gap-3"
                >
                  {/* hover background effect */}
                  <div className="from-primary/5 to-secondary/5 absolute inset-0 rounded-lg bg-gradient-to-r opacity-0 transition-opacity group-hover:opacity-100" />

                  {/* logo container */}
                  <div
                    className={`relative size-8 rounded-lg p-1.5 transition-transform group-hover:scale-110 ${
                      language === lang.id ? "bg-primary/10" : "bg-muted"
                    }`}
                  >
                    <div className="from-primary/10 to-secondary/10 absolute inset-0 rounded-lg bg-gradient-to-br opacity-0 transition-opacity group-hover:opacity-100" />
                    <img
                      width={24}
                      height={24}
                      src={lang.logoPath || "/placeholder.svg"}
                      alt={`${lang.label} logo`}
                      className="relative z-10 h-full w-full object-contain"
                    />
                  </div>

                  {/* language label */}
                  <span className="group-hover:text-foreground flex-1 text-left transition-colors">
                    {lang.label}
                  </span>

                  {/* selected sparkle */}
                  {language === lang.id && (
                    <Sparkles className="text-primary h-4 w-4 animate-pulse" />
                  )}

                  {/* active border */}
                  {language === lang.id && (
                    <motion.div
                      className="border-primary/30 absolute inset-0 rounded-lg border-2"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                </motion.div>
              </DropdownMenuItem>
            ))}
          </div>
        </motion.div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
