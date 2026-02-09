import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Play, Pause, RotateCcw, AlertTriangle, Timer } from "lucide-react";

const POMODORO_DURATION = 25 * 60; // 25 minutes in seconds

export function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(POMODORO_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [strictMode, setStrictMode] = useState(false);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  const { user, refreshProgress } = useAuth();
  const { toast } = useToast();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const progress = ((POMODORO_DURATION - timeLeft) / POMODORO_DURATION) * 100;
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startSession = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("pomodoro_sessions")
      .insert({
        user_id: user.id,
        strict_mode: strictMode,
        duration_minutes: 25,
      })
      .select()
      .single();

    if (!error && data) {
      setSessionId(data.id);
    }
  };

  const completeSession = async () => {
    if (!user || !sessionId) return;

    // Update session as completed
    await supabase
      .from("pomodoro_sessions")
      .update({
        completed: true,
        completed_at: new Date().toISOString(),
        tab_switches: tabSwitches,
      })
      .eq("id", sessionId);

    // Update user progress
    const { data: currentProgress } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (currentProgress) {
      const newXp = currentProgress.xp + 50;
      const newSessions = currentProgress.total_sessions + 1;
      const badges = [...(currentProgress.badges || [])];

      // Check for new badges
      const badgeChecks = [
        { id: "novice", sessions: 1, icon: "🥉", name: "Novice" },
        { id: "productif", sessions: 10, icon: "🥈", name: "Productif" },
        { id: "expert", sessions: 50, icon: "🥇", name: "Expert" },
        { id: "en_feu", sessions: 100, icon: "🔥", name: "En Feu" },
        { id: "diamant", sessions: 200, icon: "💎", name: "Diamant" },
        { id: "gardien", sessions: 500, icon: "🛡️", name: "Gardien de la Concentration" },
      ];

      for (const check of badgeChecks) {
        if (newSessions >= check.sessions && !badges.includes(check.id)) {
          badges.push(check.id);
          toast({
            title: `Badge débloqué! ${check.icon}`,
            description: `Félicitations! Vous avez obtenu le badge ${check.name}!`,
          });
        }
      }

      // Level up celebration
      const oldLevel = Math.floor(currentProgress.xp / 100) + 1;
      const newLevel = Math.floor(newXp / 100) + 1;
      if (newLevel > oldLevel) {
        toast({
          title: `🎉 Niveau ${newLevel} atteint!`,
          description: `Bravo! Vous êtes maintenant niveau ${newLevel}!`,
        });
      }

      await supabase
        .from("user_progress")
        .update({
          xp: newXp,
          total_sessions: newSessions,
          badges,
        })
        .eq("user_id", user.id);

      await refreshProgress();
    }

    toast({
      title: "Session terminée! 🎉",
      description: "+50 XP gagnés! Bravo pour votre concentration!",
    });

    setSessionId(null);
  };

  const handleStart = () => {
    if (!isRunning && timeLeft === POMODORO_DURATION) {
      startSession();
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(POMODORO_DURATION);
    setTabSwitches(0);
    setSessionId(null);
  };

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      completeSession();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  // Visibility API for strict mode
  useEffect(() => {
    if (!strictMode || !isRunning) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitches((prev) => prev + 1);
        setShowWarning(true);
        
        toast({
          title: "⚠️ Focus perdu!",
          description: "Vous avez quitté l'onglet. Restez concentré!",
          variant: "destructive",
        });

        setTimeout(() => setShowWarning(false), 3000);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [strictMode, isRunning, toast]);

  return (
    <Card className={`glass-card relative overflow-hidden ${showWarning ? "animate-pulse-glow ring-2 ring-destructive" : ""}`}>
      {showWarning && (
        <div className="absolute inset-0 bg-destructive/10 flex items-center justify-center z-10">
          <div className="glass-card flex items-center gap-3 animate-bounce-subtle">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            <span className="font-semibold text-destructive">Revenez au focus!</span>
          </div>
        </div>
      )}

      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Timer className="h-5 w-5" />
          Timer Pomodoro
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col items-center gap-6">
        {/* SVG Timer */}
        <div className="relative">
          <svg width="260" height="260" className="transform -rotate-90">
            <defs>
              <linearGradient id="timer-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(262, 83%, 58%)" />
                <stop offset="100%" stopColor="hsl(280, 87%, 65%)" />
              </linearGradient>
            </defs>
            {/* Background circle */}
            <circle
              cx="130"
              cy="130"
              r="120"
              fill="none"
              stroke="hsl(var(--xp-bar-background))"
              strokeWidth="12"
            />
            {/* Progress circle */}
            <circle
              cx="130"
              cy="130"
              r="120"
              fill="none"
              stroke="url(#timer-gradient)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          {/* Time display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold tabular-nums">
              {formatTime(timeLeft)}
            </span>
            <span className="text-sm text-muted-foreground mt-2">
              {isRunning ? "En cours..." : timeLeft === POMODORO_DURATION ? "Prêt" : "En pause"}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          {!isRunning ? (
            <Button
              onClick={handleStart}
              size="lg"
              className="gradient-primary text-primary-foreground px-8"
            >
              <Play className="mr-2 h-5 w-5" />
              {timeLeft === POMODORO_DURATION ? "Démarrer" : "Reprendre"}
            </Button>
          ) : (
            <Button
              onClick={handlePause}
              size="lg"
              variant="secondary"
              className="px-8"
            >
              <Pause className="mr-2 h-5 w-5" />
              Pause
            </Button>
          )}
          <Button
            onClick={handleReset}
            size="lg"
            variant="outline"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>

        {/* Strict Mode Toggle */}
        <div className="flex items-center space-x-3 p-4 rounded-xl bg-secondary/50">
          <Switch
            id="strict-mode"
            checked={strictMode}
            onCheckedChange={setStrictMode}
            disabled={isRunning}
          />
          <Label htmlFor="strict-mode" className="flex flex-col">
            <span className="font-medium">Mode Strict</span>
            <span className="text-xs text-muted-foreground">
              Alerte si vous quittez l'onglet
            </span>
          </Label>
        </div>

        {/* Tab switches counter */}
        {tabSwitches > 0 && (
          <p className="text-sm text-muted-foreground">
            Sorties d'onglet : <span className="font-semibold text-warning">{tabSwitches}</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
