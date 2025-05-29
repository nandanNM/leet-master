import { Activity, Timer, UserIcon, Zap } from "lucide-react";
import { motion } from "framer-motion";
import type { AuthUser, UserSubmissionStats } from "@/types";
import ProfileHeaderSkeleton from "./ProfileHeaderSkeleton";

interface ProfileHeaderProps {
  submissionStats: UserSubmissionStats | null;
  userData: AuthUser | null;
  isLoading: boolean;
}

function ProfileHeader({
  submissionStats,
  userData,
  isLoading,
}: ProfileHeaderProps) {
  const STATS = [
    {
      label: "Code Executions",
      value: submissionStats?.totalSubmissions ?? 0,
      icon: Activity,
      color: "from-blue-500 to-cyan-500",
      gradient: "group-hover:via-blue-400",
      description: "Total code runs",
      metric: {
        label: "Last 24h",
        value: submissionStats?.submissionsLast24Hours ?? 0,
        icon: Timer,
      },
    },
    // {
    //   label: "Starred Snippets",
    //   value: 0,
    //   icon: Star,
    //   color: "from-yellow-500 to-orange-500",
    //   gradient: "group-hover:via-yellow-400",
    //   description: "Saved for later",
    //   metric: {
    //     label: "Most starred",
    //     value: userStats?.mostStarredLanguage ?? "N/A",
    //     icon: Trophy,
    //   },
    // },
    // {
    //   label: "Languages Used",
    //   value: userStats?.languagesCount ?? 0,
    //   icon: Code2,
    //   color: "from-purple-500 to-pink-500",
    //   gradient: "group-hover:via-purple-400",
    //   description: "Different languages",
    //   metric: {
    //     label: "Most used",
    //     value: userStats?.favoriteLanguage ?? "N/A",
    //     icon: TrendingUp,
    //   },
    // },
  ];
  if (isLoading) {
    return <ProfileHeaderSkeleton />;
  }
  return (
    <div className="from-background to-muted/50 border-border relative mb-2 overflow-hidden rounded-2xl border bg-gradient-to-br p-8">
      <div className="bg-grid-white/[0.02] absolute inset-0 bg-[size:32px]" />
      <div className="relative flex items-center gap-8">
        <div className="group relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-50 blur-xl transition-opacity group-hover:opacity-75" />
          <img
            src={"https://i.pravatar.cc/300"}
            alt="Profile"
            className="border-border relative z-10 h-24 w-24 rounded-full border-4 transition-transform group-hover:scale-105"
          />
          {userData && userData.role === "ADMIN" && (
            <div className="absolute -top-2 -right-2 z-20 animate-pulse rounded-full bg-gradient-to-r from-purple-500 to-purple-600 p-2 shadow-lg">
              <Zap className="h-4 w-4 text-white" />
            </div>
          )}
        </div>
        <div>
          <div className="mb-2 flex items-center gap-3">
            <h1 className="text-3xl font-bold">{userData?.name}</h1>
            {userData && userData.role === "ADMIN" && (
              <span className="rounded-full bg-purple-500/10 px-3 py-1 text-sm font-medium text-purple-400">
                admin user
              </span>
            )}
          </div>
          <p className="text-muted-foreground flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            {userData?.email}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {STATS.map((stat, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            key={index}
            className="group from-background/60 to-muted/30 relative overflow-hidden rounded-2xl border bg-gradient-to-br"
          >
            {/* Glow effect */}
            <div
              className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 transition-all duration-500 group-hover:opacity-10 ${stat.gradient}`}
            />

            {/* Content */}
            <div className="relative p-6">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-muted-foreground text-sm font-medium">
                      {stat.description}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight">
                    {typeof stat.value === "number"
                      ? stat.value.toLocaleString()
                      : stat.value}
                  </h3>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {stat.label}
                  </p>
                </div>
                <div
                  className={`rounded-xl bg-gradient-to-br p-3 ${stat.color} bg-opacity-10`}
                >
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
              </div>

              {/* Additional metric */}
              <div className="border-border flex items-center gap-2 border-t pt-4">
                <stat.metric.icon className="text-muted-foreground h-4 w-4" />
                <span className="text-muted-foreground text-sm">
                  {stat.metric.label}:
                </span>
                <span className="text-sm font-medium">{stat.metric.value}</span>
              </div>
            </div>

            {/* Interactive hover effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
export default ProfileHeader;
