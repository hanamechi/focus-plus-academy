import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Award, Star } from "lucide-react";

const BADGES = [
  { id: "novice", name: "Novice", icon: "🥉", sessions: 1, description: "Première session complétée" },
  { id: "productif", name: "Productif", icon: "🥈", sessions: 10, description: "10 sessions complétées" },
  { id: "expert", name: "Expert", icon: "🥇", sessions: 50, description: "50 sessions complétées" },
];

export function ProgressCard() {
  const { progress } = useAuth();

  const totalSessions = progress?.total_sessions || 0;
  const userBadges = progress?.badges || [];
  const xp = progress?.xp || 0;

  // Calculate progress to next badge
  const getNextBadge = () => {
    if (totalSessions < 1) return { badge: BADGES[0], progress: 0 };
    if (totalSessions < 10) return { badge: BADGES[1], progress: (totalSessions / 10) * 100 };
    if (totalSessions < 50) return { badge: BADGES[2], progress: (totalSessions / 50) * 100 };
    return { badge: null, progress: 100 };
  };

  const nextBadgeInfo = getNextBadge();

  return (
    <Card className="glass-card h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Ma Progression
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* XP Display */}
        <div className="text-center p-4 rounded-xl bg-primary/10">
          <p className="text-4xl font-bold gradient-text">{xp}</p>
          <p className="text-sm text-muted-foreground">Points d'expérience</p>
        </div>

        {/* Sessions completed */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Sessions complétées</span>
          <span className="font-semibold">{totalSessions}</span>
        </div>

        {/* Next Badge Progress */}
        {nextBadgeInfo.badge && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Prochain badge</span>
              <span className="flex items-center gap-1">
                <span>{nextBadgeInfo.badge.icon}</span>
                <span className="font-medium">{nextBadgeInfo.badge.name}</span>
              </span>
            </div>
            <Progress value={nextBadgeInfo.progress} className="h-2" />
            <p className="text-xs text-muted-foreground text-center">
              {totalSessions} / {nextBadgeInfo.badge.sessions} sessions
            </p>
          </div>
        )}

        {/* Badges */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Award className="h-4 w-4" />
            Mes Badges
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {BADGES.map((badge) => {
              const isUnlocked = userBadges.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                    isUnlocked
                      ? "bg-primary/10 border border-primary/30"
                      : "bg-muted/50 opacity-50"
                  }`}
                >
                  <span className="text-2xl">{badge.icon}</span>
                  <span className="text-xs font-medium mt-1">{badge.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
