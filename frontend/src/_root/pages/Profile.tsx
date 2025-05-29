import HeatmapCalendar from "@/components/profile/HeatmapCalendar";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabSubmissions from "@/components/profile/ProfileTabSubmissions";
import { useAuthStore, useSubmissionStore } from "@/store";
import { useEffect } from "react";

export default function ProfilePage() {
  const { authUser: user } = useAuthStore();
  const {
    getSubmissionStats,
    submissionStats,
    isSubmissionStatsLoading,
    getHeatmapData,
    hetmapData,
    isHetmapLoading,
  } = useSubmissionStore();
  useEffect(() => {
    getSubmissionStats();
    getHeatmapData();
  }, [getSubmissionStats, getHeatmapData]);
  return (
    <div className="bg-background mx-auto min-h-screen max-w-7xl">
      <ProfileHeader
        isLoading={isSubmissionStatsLoading}
        submissionStats={submissionStats}
        userData={user}
      />
      <HeatmapCalendar isLoading={isHetmapLoading} data={hetmapData} />
      <ProfileTabSubmissions />
    </div>
  );
}
