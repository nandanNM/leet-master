import { useCodeEditorStore } from "@/store/code-cditor-store";
import type React from "react";
import { motion } from "framer-motion";
import {
  CircleOff,
  Cloud,
  Github,
  Laptop,
  Moon,
  Palette,
  Sun,
} from "lucide-react";
import useMounted from "@/hooks/useMounted";
import type { Theme } from "@/types";
import { THEMES } from "@/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const THEME_ICONS: Record<string, React.ReactNode> = {
  "vs-dark": <Moon className="size-4" />,
  "vs-light": <Sun className="size-4" />,
  "github-dark": <Github className="size-4" />,
  monokai: <Laptop className="size-4" />,
  "solarized-dark": <Cloud className="size-4" />,
};

export default function ThemeSelector() {
  const mounted = useMounted();
  const { theme, setTheme } = useCodeEditorStore();
  const currentTheme = THEMES.find((t: Theme) => t.id === theme);

  if (!mounted) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="group border-border bg-popover hover:border-muted hover:bg-muted hover:text-foreground relative flex w-48 items-center gap-2 rounded-lg border px-4 py-2.5 transition-all"
        >
          <motion.div
            className="from-primary/5 to-secondary/5 absolute inset-0 rounded-lg bg-gradient-to-r opacity-0 transition-opacity group-hover:opacity-100"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          />

          <Palette className="text-muted-foreground group-hover:text-foreground h-4 w-4" />

          <span className="text-muted-foreground group-hover:text-foreground min-w-[80px] text-left">
            {currentTheme?.label}
          </span>

          <div
            className="border-border group-hover:border-muted relative h-4 w-4 rounded-full border"
            style={{ background: currentTheme?.color }}
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="border-border bg-popover/95 w-[240px] rounded-xl border py-2 shadow-2xl backdrop-blur-xl"
        align="start"
      >
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <DropdownMenuLabel className="text-muted-foreground px-2 text-xs font-medium">
            Select Theme
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="border-muted" />

          {THEMES.map((t: Theme, index: number) => (
            <DropdownMenuItem
              key={t.id}
              className={`group hover:bg-muted focus:bg-muted relative flex w-full items-center gap-3 px-3 py-2.5 transition-all duration-200 ${
                theme === t.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground"
              }`}
              onClick={() => setTheme(t.id)}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex w-full items-center gap-3"
              >
                <div className="from-primary/5 to-secondary/5 absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity group-hover:opacity-100" />

                <div
                  className={`flex size-8 items-center justify-center rounded-lg ${
                    theme === t.id
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  } transition-all duration-200 group-hover:scale-110`}
                >
                  {THEME_ICONS[t.id] || <CircleOff className="h-4 w-4" />}
                </div>

                <span className="group-hover:text-foreground flex-1 text-left">
                  {t.label}
                </span>

                <div
                  className="border-border group-hover:border-muted relative size-4 rounded-full border"
                  style={{ background: t.color }}
                />

                {theme === t.id && (
                  <motion.div
                    className="border-primary/30 absolute inset-0 rounded-lg border-2"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.div>
            </DropdownMenuItem>
          ))}
        </motion.div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
