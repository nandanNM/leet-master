import { features } from "@/constants";
import { Card, CardContent } from "./ui/card";
import { cn } from "@/lib/utils";
import { MorphingText } from "./liquid-text";
const texts = [
  "Solve",
  "Code",
  "Learn",
  "Master",
  "Challenge",
  "Grow",
  "Innovate",
  "Succeed",
];

export default function LeetMasterFeatures() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br p-8">
      <div className="w-full max-w-6xl">
        <div className="mb-8 text-center">
          <MorphingText texts={texts} />
          <p className="text-muted-foreground mt-3 text-xl">
            Master coding challenges and ace your technical interviews with Leet
            Master.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-2 space-y-0.5 overflow-hidden rounded-[1rem] p-0.5 shadow-lg sm:grid-cols-2 sm:gap-0.5 sm:space-y-0 lg:grid-cols-3">
          {features.map((action) => (
            <Card
              key={action.title}
              className={cn(
                "group bg-card focus-within:ring-ring relative rounded-xl border-0 p-0 focus-within:ring-2 focus-within:ring-inset",
              )}
            >
              <CardContent className="p-6">
                <div>
                  <span
                    className={cn(
                      action.iconBackground,
                      action.iconForeground,
                      "inline-flex rounded-lg p-3 ring-2 ring-inset",
                      action.ringColorClass,
                    )}
                  >
                    <action.icon aria-hidden="true" className="h-6 w-6" />
                  </span>
                </div>
                <div className="mt-4">
                  <p className="text-muted-foreground mt-2 text-sm">
                    {action.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
