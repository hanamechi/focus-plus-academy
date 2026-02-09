import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Clock, TrendingUp, TrendingDown, Minus, Flame, Calendar, Zap } from "lucide-react";
import { format, subDays, startOfDay, endOfDay, differenceInMinutes } from "date-fns";
import { fr } from "date-fns/locale";

interface Session {
  duration_minutes: number;
  completed: boolean;
  started_at: string;
  completed_at: string | null;
}

interface DayData {
  day: string;
  dayShort: string;
  minutes: number;
}

export function StudyStats() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [prevWeekSessions, setPrevWeekSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchAllSessions = async () => {
      const twoWeeksAgo = subDays(new Date(), 14);

      const { data } = await supabase
        .from("pomodoro_sessions")
        .select("duration_minutes, completed, started_at, completed_at")
        .eq("user_id", user.id)
        .eq("completed", true)
        .gte("started_at", twoWeeksAgo.toISOString())
        .order("started_at", { ascending: true });

      if (data) {
        const now = new Date();
        const weekAgo = subDays(now, 7);
        
        const thisWeek = data.filter(s => new Date(s.started_at) >= weekAgo);
        const lastWeek = data.filter(s => {
          const d = new Date(s.started_at);
          return d < weekAgo && d >= subDays(now, 14);
        });

        setSessions(thisWeek);
        setPrevWeekSessions(lastWeek);
      }
      setLoading(false);
    };

    // Also fetch total study time (all sessions ever)
    fetchAllSessions();
  }, [user]);

  const [totalMinutesAllTime, setTotalMinutesAllTime] = useState(0);

  useEffect(() => {
    if (!user) return;
    const fetchTotal = async () => {
      const { data } = await supabase
        .from("pomodoro_sessions")
        .select("duration_minutes")
        .eq("user_id", user.id)
        .eq("completed", true);
      
      if (data) {
        setTotalMinutesAllTime(data.reduce((sum, s) => sum + s.duration_minutes, 0));
      }
    };
    fetchTotal();
  }, [user]);

  // Weekly chart data
  const weeklyData = useMemo<DayData[]>(() => {
    const days: DayData[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dayStart = startOfDay(date);
      const dayEnd = endOfDay(date);
      
      const dayMinutes = sessions
        .filter(s => {
          const d = new Date(s.started_at);
          return d >= dayStart && d <= dayEnd;
        })
        .reduce((sum, s) => sum + s.duration_minutes, 0);

      days.push({
        day: format(date, "EEEE", { locale: fr }),
        dayShort: format(date, "EEE", { locale: fr }),
        minutes: dayMinutes,
      });
    }
    return days;
  }, [sessions]);

  // Metrics
  const thisWeekTotal = sessions.reduce((sum, s) => sum + s.duration_minutes, 0);
  const prevWeekTotal = prevWeekSessions.reduce((sum, s) => sum + s.duration_minutes, 0);
  const avgPerDay = Math.round(thisWeekTotal / 7);
  const weekDiff = prevWeekTotal > 0
    ? Math.round(((thisWeekTotal - prevWeekTotal) / prevWeekTotal) * 100)
    : thisWeekTotal > 0 ? 100 : 0;

  const totalHours = Math.floor(totalMinutesAllTime / 60);
  const totalMins = totalMinutesAllTime % 60;

  // Best day this week
  const bestDay = weeklyData.reduce((best, d) => d.minutes > best.minutes ? d : best, weeklyData[0]);

  // Motivation message
  const getMotivationMessage = () => {
    if (totalMinutesAllTime === 0) return { text: "Commencez votre première session pour voir vos stats ! 🚀", icon: Zap };
    if (weekDiff > 20) return { text: `Incroyable ! +${weekDiff}% par rapport à la semaine dernière. Vous êtes en feu ! 🔥`, icon: Flame };
    if (weekDiff > 0) return { text: `Bonne progression ! +${weekDiff}% cette semaine. Continuez ainsi ! 💪`, icon: TrendingUp };
    if (weekDiff === 0) return { text: "Vous maintenez votre rythme. Essayez de vous dépasser ! ⚡", icon: Minus };
    if (bestDay && bestDay.minutes >= 50) return { text: `Record de ${bestDay.minutes} min le ${bestDay.day} ! Bravo ! 🏆`, icon: Flame };
    return { text: "Chaque session compte. Reprenez le rythme ! 💡", icon: Zap };
  };

  const motivation = getMotivationMessage();
  const MotivIcon = motivation.icon;

  if (loading) {
    return (
      <Card className="glass-card">
        <CardContent className="p-6 flex items-center justify-center h-64">
          <div className="animate-pulse text-muted-foreground">Chargement...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Motivation Banner */}
      <Card className="glass-card border-primary/20 overflow-hidden relative">
        <div className="absolute inset-0 gradient-primary opacity-5" />
        <CardContent className="p-4 flex items-center gap-3 relative">
          <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
            <MotivIcon className="h-5 w-5 text-primary-foreground" />
          </div>
          <p className="font-medium text-sm">{motivation.text}</p>
        </CardContent>
      </Card>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Study Time */}
        <Card className="glass-card">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl gradient-primary flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {totalHours}<span className="text-base font-normal text-muted-foreground">h</span>{" "}
                  {totalMins}<span className="text-base font-normal text-muted-foreground">min</span>
                </p>
                <p className="text-xs text-muted-foreground">Temps total d'étude</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Average Per Day */}
        <Card className="glass-card">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl gradient-accent flex items-center justify-center">
                <Calendar className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {avgPerDay}<span className="text-base font-normal text-muted-foreground"> min/j</span>
                </p>
                <p className="text-xs text-muted-foreground">Moyenne quotidienne</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Week Comparison */}
        <Card className="glass-card">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${
                weekDiff >= 0 ? "bg-success" : "bg-destructive"
              }`}>
                {weekDiff >= 0 ? (
                  <TrendingUp className="h-5 w-5 text-success-foreground" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-destructive-foreground" />
                )}
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {weekDiff >= 0 ? "+" : ""}{weekDiff}<span className="text-base font-normal text-muted-foreground">%</span>
                </p>
                <p className="text-xs text-muted-foreground">vs semaine précédente</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Chart */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-5 w-5" />
            Activité des 7 derniers jours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyData} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="dayShort"
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
                unit=" min"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.75rem",
                  fontSize: "0.875rem",
                }}
                formatter={(value: number) => [`${value} min`, "Temps d'étude"]}
                labelFormatter={(label) => label}
              />
              <Bar
                dataKey="minutes"
                radius={[8, 8, 0, 0]}
                fill="url(#barGradient)"
              />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(262, 83%, 58%)" />
                  <stop offset="100%" stopColor="hsl(280, 87%, 65%)" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
