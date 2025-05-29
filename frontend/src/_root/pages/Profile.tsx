import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabSubmissions from "@/components/profile/ProfileTabSubmissions";

const dummyUserStats = {
  totalExecutions: 1245,
  languagesCount: 5,
  languages: ["JavaScript", "Python", "TypeScript", "Go", "Rust"],
  last24Hours: 37,
  favoriteLanguage: "TypeScript",
  languageStats: {
    JavaScript: 400,
    Python: 320,
    TypeScript: 450,
    Go: 50,
    Rust: 25,
  },
  mostStarredLanguage: "JavaScript",
};

const dummyUserData = {
  _id: "user_dummy_id" as string,
  _creationTime: Date.now(),
  proSince: Date.now() - 100000000,
  lemonSqueezyCustomerId: "cust_123",
  lemonSqueezyOrderId: "order_456",
  name: "John Doe",
  userId: "user_123",
  email: "johndoe@example.com",
  isPro: true,
};

export default function ProfilePage() {
  return (
    <div className="bg-background mx-auto min-h-screen max-w-7xl">
      <ProfileHeader userStats={dummyUserStats} userData={dummyUserData} />
      <ProfileTabSubmissions />
    </div>
  );
}
