import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Award, Zap, Sparkles } from "lucide-react";

const BADGES = [
  { id: "novice", name: "Novice", icon: "🥉", sessions: 1, description: "1ère session" },
  { id: "productif", name: "Productif", icon: "🥈", sessions: 10, description: "10 sessions" },
  { id: "expert", name: "Expert", icon: "🥇", sessions: 50, description: "50 sessions" },
  { id: "en_feu", name: "En Feu", icon: "🔥", sessions: 100, description: "100 sessions" },
  { id: "diamant", name: "Diamant", icon: "💎", sessions: 200, description: "200 sessions" },
  { id: "gardien", name: "Gardien", icon: "🛡️", sessions: 500, description: "500 sessions" },
];

export function EnhancedProgressCard() {
  const { progress } = useAuth();

  const totalSessions = progress?.total_sessions || 0;
  const userBadges = progress?.badges || [];
  const xp = progress?.xp || 0;

  const level = Math.floor(xp / 100) + 1;
  const xpInLevel = xp % 100;
  const xpToNext = 100;

  const getLevelTitle = () => {
    if (level >= 50) return "Maître Absolu";
    if (level >= 30) return "Grand Sage";
    if (level >= 20) return "Stratège";
    if (level >= 10) return "Apprenti Avancé";
    if (level >= 5) return "Initié";
    return "Débutant";
  };

  const getNextBadge = () => {
    for (const badge of BADGES) {
      if (!userBadges.includes(badge.id)) {
        return { badge, progress: Math.min((totalSessions / badge.sessions) * 100, 99) };
      }
    }
    return { badge: null, progress: 100 };
  };

  const nextBadgeInfo = getNextBadge();

  return (
    <Card className="glass-card h-full relative overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Trophy className="h-5 w-5" />
          Ma Progression
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Level Display */}
        <div className="text-center p-4 rounded-xl bg-primary/10 relative overflow-hidden">
          <div className="absolute inset-0 gradient-primary opacity-5" />
          <div className="relative">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">{getLevelTitle()}</p>
            <p className="text-5xl font-black gradient-text mt-1">{level}</p>
            <p className="text-xs text-muted-foreground mt-1">Niveau</p>
          </div>
        </div>

        {/* XP to next level */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <Zap className="h-3.5 w-3.5" />
              XP
            </span>
            <span className="font-semibold">{xp} XP</span>
          </div>
          <div className="xp-progress">
            <div className="xp-progress-fill" style={{ width: `${(xpInLevel / xpToNext) * 100}%` }} />
          </div>
          <p className="text-xs text-muted-foreground text-center">
            {xpInLevel} / {xpToNext} XP → Niveau {level + 1}
          </p>
        </div>

        {/* Sessions */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Sessions complétées</span>
          <span className="font-semibold">{totalSessions}</span>
        </div>

        {/* Next Badge */}
        {nextBadgeInfo.badge && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Prochain badge</span>
              <span className="flex items-center gap-1">
                <span>{nextBadgeInfo.badge.icon}</span>
                <span className="font-medium text-xs">{nextBadgeInfo.badge.name}</span>
              </span>
            </div>
            <Progress value={nextBadgeInfo.progress} className="h-2" />
            <p className="text-xs text-muted-foreground text-center">
              {totalSessions} / {nextBadgeInfo.badge.sessions} sessions
            </p>
          </div>
        )}

        {/* Badges Grid */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Award className="h-4 w-4" />
            Badges
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {BADGES.map((badge) => {
              const isUnlocked = userBadges.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  className={`flex flex-col items-center p-2.5 rounded-xl transition-all relative ${
                    isUnlocked
                      ? "bg-primary/10 border border-primary/30"
                      : "bg-muted/50 opacity-40 grayscale"
                  }`}
                >
                  {isUnlocked && (
                    <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-success flex items-center justify-center">
                      <span className="text-[8px] text-success-foreground">✓</span>
                    </div>
                  )}
                  <span className="text-xl">{badge.icon}</span>
                  <span className="text-[10px] font-medium mt-1 text-center leading-tight">{badge.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
