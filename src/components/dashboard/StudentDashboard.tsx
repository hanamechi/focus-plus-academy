import { useAuth } from "@/contexts/AuthContext";
import { PomodoroTimer } from "@/components/pomodoro/PomodoroTimer";
import { ProgressCard } from "@/components/dashboard/ProgressCard";
import { RecentSessions } from "@/components/dashboard/RecentSessions";
import { QuickChallenges } from "@/components/dashboard/QuickChallenges";

export function StudentDashboard() {
  const { profile, progress } = useAuth();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Bonjour, {profile?.first_name} 👋
        </h1>
        <p className="text-muted-foreground">
          Prêt à être productif aujourd'hui ?
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pomodoro Timer - Takes 2 columns on large screens */}
        <div className="lg:col-span-2">
          <PomodoroTimer />
        </div>

        {/* Progress Card */}
        <div className="lg:col-span-1">
          <ProgressCard />
        </div>
      </div>

      {/* Secondary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentSessions />
        <QuickChallenges />
      </div>
    </div>
  );
}
