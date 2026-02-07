import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle2, XCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface PomodoroSession {
  id: string;
  duration_minutes: number;
  completed: boolean;
  started_at: string;
  completed_at: string | null;
  strict_mode: boolean;
  tab_switches: number;
}

export function RecentSessions() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<PomodoroSession[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchSessions = async () => {
      const { data } = await supabase
        .from("pomodoro_sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("started_at", { ascending: false })
        .limit(5);

      if (data) {
        setSessions(data);
      }
    };

    fetchSessions();
  }, [user]);

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Sessions Récentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Aucune session pour le moment
            </p>
            <p className="text-sm text-muted-foreground">
              Commencez un Pomodoro pour voir votre historique ici
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-3 rounded-xl bg-secondary/50"
              >
                <div className="flex items-center gap-3">
                  {session.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  ) : (
                    <XCircle className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div>
                    <p className="font-medium">
                      {session.duration_minutes} minutes
                      {session.strict_mode && (
                        <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-warning/20 text-warning">
                          Mode Strict
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(session.started_at), {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {session.completed ? (
                    <span className="text-sm text-success">+50 XP</span>
                  ) : (
                    <span className="text-sm text-muted-foreground">Interrompue</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
