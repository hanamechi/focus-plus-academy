import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Clock, Trophy } from "lucide-react";

interface StudentInfo {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  avatar_url: string | null;
  xp: number;
  total_sessions: number;
  total_minutes: number;
}

export function StudentList() {
  const [students, setStudents] = useState<StudentInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    // Get student role user_ids
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "student");

    if (!roleData || roleData.length === 0) {
      setLoading(false);
      return;
    }

    const studentIds = roleData.map((r) => r.user_id);

    // Fetch profiles
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, first_name, last_name, email, avatar_url")
      .in("user_id", studentIds);

    // Fetch progress
    const { data: progressData } = await supabase
      .from("user_progress")
      .select("user_id, xp, total_sessions")
      .in("user_id", studentIds);

    // Fetch total study minutes
    const { data: sessions } = await supabase
      .from("pomodoro_sessions")
      .select("user_id, duration_minutes")
      .in("user_id", studentIds)
      .eq("completed", true);

    const minutesByUser: Record<string, number> = {};
    sessions?.forEach((s) => {
      minutesByUser[s.user_id] = (minutesByUser[s.user_id] || 0) + s.duration_minutes;
    });

    const progressMap = new Map(progressData?.map((p) => [p.user_id, p]));

    const merged: StudentInfo[] = (profiles || []).map((p) => {
      const prog = progressMap.get(p.user_id);
      return {
        ...p,
        xp: prog?.xp || 0,
        total_sessions: prog?.total_sessions || 0,
        total_minutes: minutesByUser[p.user_id] || 0,
      };
    });

    merged.sort((a, b) => b.xp - a.xp);
    setStudents(merged);
    setLoading(false);
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Étudiants ({students.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center text-muted-foreground py-4">Chargement...</p>
        ) : students.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            Aucun étudiant inscrit pour le moment
          </p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {students.map((student) => (
              <div
                key={student.user_id}
                className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={student.avatar_url || undefined} />
                  <AvatarFallback className="text-xs">
                    {student.first_name[0]}
                    {student.last_name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {student.first_name} {student.last_name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {student.email}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1" title="XP">
                    <Trophy className="h-3.5 w-3.5 text-yellow-500" />
                    {student.xp}
                  </span>
                  <span className="flex items-center gap-1" title="Temps d'étude">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    {Math.floor(student.total_minutes / 60)}h{student.total_minutes % 60}m
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
