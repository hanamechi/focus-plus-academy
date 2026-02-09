import { useAuth } from "@/contexts/AuthContext";
import { EnhancedProgressCard } from "@/components/dashboard/EnhancedProgressCard";
import { RecentSessions } from "@/components/dashboard/RecentSessions";
import { StudyStats } from "@/components/dashboard/StudyStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Target, Award, Sparkles } from "lucide-react";

const ALL_BADGES = [
  { id: "novice", name: "Novice", icon: "🥉", sessions: 1, description: "Complétez votre première session Pomodoro" },
  { id: "productif", name: "Productif", icon: "🥈", sessions: 10, description: "Complétez 10 sessions Pomodoro" },
  { id: "expert", name: "Expert", icon: "🥇", sessions: 50, description: "Complétez 50 sessions Pomodoro" },
  { id: "en_feu", name: "En Feu", icon: "🔥", sessions: 100, description: "Complétez 100 sessions Pomodoro" },
  { id: "diamant", name: "Diamant", icon: "💎", sessions: 200, description: "Complétez 200 sessions Pomodoro" },
  { id: "gardien", name: "Gardien de la Concentration", icon: "🛡️", sessions: 500, description: "Complétez 500 sessions Pomodoro" },
];

export default function Progress() {
  const { progress } = useAuth();

  const totalSessions = progress?.total_sessions || 0;
  const userBadges = progress?.badges || [];
  const xp = progress?.xp || 0;
  const level = Math.floor(xp / 100) + 1;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Ma Progression</h1>
        <p className="text-muted-foreground">
          Suivez vos statistiques et débloquez des badges
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-3xl font-bold">{level}</p>
                <p className="text-sm text-muted-foreground">Niveau</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center">
                <Trophy className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-3xl font-bold">{xp}</p>
                <p className="text-sm text-muted-foreground">Points XP</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl gradient-accent flex items-center justify-center">
                <Target className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <p className="text-3xl font-bold">{totalSessions}</p>
                <p className="text-sm text-muted-foreground">Sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-warning flex items-center justify-center">
                <Award className="h-6 w-6 text-warning-foreground" />
              </div>
              <div>
                <p className="text-3xl font-bold">{userBadges.length}</p>
                <p className="text-sm text-muted-foreground">Badges</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Study Stats */}
      <StudyStats />

      {/* Badges Section */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Collection de Badges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ALL_BADGES.map((badge) => {
              const isUnlocked = userBadges.includes(badge.id);
              const progressPercent = Math.min((totalSessions / badge.sessions) * 100, 100);

              return (
                <div
                  key={badge.id}
                  className={`p-6 rounded-2xl transition-all relative overflow-hidden ${
                    isUnlocked
                      ? "bg-primary/10 border-2 border-primary/30"
                      : "bg-muted/50 border-2 border-transparent"
                  }`}
                >
                  {isUnlocked && (
                    <div className="absolute top-2 right-2">
                      <div className="h-6 w-6 rounded-full bg-success flex items-center justify-center">
                        <span className="text-xs text-success-foreground">✓</span>
                      </div>
                    </div>
                  )}
                  <div className="text-center">
                    <span className={`text-5xl ${isUnlocked ? "" : "grayscale opacity-50"}`}>{badge.icon}</span>
                    <h3 className="text-lg font-semibold mt-3">{badge.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{badge.description}</p>

                    {!isUnlocked && (
                      <div className="mt-4">
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full gradient-primary transition-all"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          {totalSessions} / {badge.sessions} sessions
                        </p>
                      </div>
                    )}

                    {isUnlocked && (
                      <p className="text-sm text-success font-medium mt-4">✓ Débloqué</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <RecentSessions />
    </div>
  );
}
