import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BookOpen, ArrowRight, Calendar } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Challenge {
  id: string;
  title: string;
  subject: string;
  start_date: string;
  end_date: string;
}

export function QuickChallenges() {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    const fetchChallenges = async () => {
      const { data } = await supabase
        .from("challenges")
        .select("id, title, subject, start_date, end_date")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(3);

      if (data) {
        setChallenges(data);
      }
    };

    fetchChallenges();
  }, []);

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Défis Disponibles
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/dashboard/challenges")}
          className="text-primary"
        >
          Voir tout
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {challenges.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Aucun défi disponible pour le moment
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                className="p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
                onClick={() => navigate(`/dashboard/challenge/${challenge.id}`)}
              >
                <h3 className="font-medium">{challenge.title}</h3>
                <p className="text-sm text-muted-foreground">{challenge.subject}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>
                    Jusqu'au {format(new Date(challenge.end_date), "d MMMM", { locale: fr })}
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
