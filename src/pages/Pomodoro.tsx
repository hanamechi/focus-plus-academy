import { PomodoroTimer } from "@/components/pomodoro/PomodoroTimer";
import { EnhancedProgressCard } from "@/components/dashboard/EnhancedProgressCard";
import { RecentSessions } from "@/components/dashboard/RecentSessions";

export default function Pomodoro() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Timer Pomodoro</h1>
        <p className="text-muted-foreground">
          Concentrez-vous pendant 25 minutes et gagnez des XP
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PomodoroTimer />
        </div>
        <div className="lg:col-span-1">
          <EnhancedProgressCard />
        </div>
      </div>

      <RecentSessions />
    </div>
  );
}
