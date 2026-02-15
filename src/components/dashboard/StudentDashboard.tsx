import { useAuth } from "@/contexts/AuthContext";
import { PomodoroTimer } from "@/components/pomodoro/PomodoroTimer";
import { EnhancedProgressCard } from "@/components/dashboard/EnhancedProgressCard";
import { RecentSessions } from "@/components/dashboard/RecentSessions";
import { QuickChallenges } from "@/components/dashboard/QuickChallenges";
import { StudyStats } from "@/components/dashboard/StudyStats";
import { TodoList } from "@/components/dashboard/TodoList";
import { AssignedTasksList } from "@/components/dashboard/AssignedTasksList";

export function StudentDashboard() {
  const { profile } = useAuth();

  return (
    <div className="space-y-6 animate-fade-in">
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
        <div className="lg:col-span-2">
          <PomodoroTimer />
        </div>
        <div className="lg:col-span-1">
          <EnhancedProgressCard />
        </div>
      </div>

      {/* Study Stats */}
      <StudyStats />

      {/* Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TodoList />
        <AssignedTasksList />
      </div>

      {/* Secondary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentSessions />
        <QuickChallenges />
      </div>
    </div>
  );
}
