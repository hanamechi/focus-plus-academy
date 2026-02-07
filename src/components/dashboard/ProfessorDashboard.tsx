import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, BookOpen, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Challenge {
  id: string;
  title: string;
  subject: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  participant_count: number;
}

export function ProfessorDashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [stats, setStats] = useState({
    totalChallenges: 0,
    activeChallenges: 0,
    totalParticipants: 0,
  });

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    const { data: challengesData } = await supabase
      .from("challenges")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    if (challengesData) {
      // Fetch participant counts for each challenge
      const challengesWithCounts = await Promise.all(
        challengesData.map(async (challenge) => {
          const { count } = await supabase
            .from("challenge_participants")
            .select("*", { count: "exact", head: true })
            .eq("challenge_id", challenge.id);
          
          return {
            ...challenge,
            participant_count: count || 0,
          };
        })
      );

      setChallenges(challengesWithCounts);
      
      // Calculate stats
      const totalParticipants = challengesWithCounts.reduce(
        (sum, c) => sum + c.participant_count,
        0
      );
      
      setStats({
        totalChallenges: challengesData.length,
        activeChallenges: challengesData.filter((c) => c.is_active).length,
        totalParticipants,
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Bonjour, {profile?.first_name} 👨‍🏫
          </h1>
          <p className="text-muted-foreground">
            Gérez vos défis et suivez la participation des étudiants
          </p>
        </div>
        <Button 
          onClick={() => navigate("/dashboard/create-challenge")}
          className="gradient-primary text-primary-foreground"
        >
          <Plus className="mr-2 h-4 w-4" />
          Créer un Défi
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalChallenges}</p>
                <p className="text-sm text-muted-foreground">Total Défis</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl gradient-accent flex items-center justify-center">
                <Calendar className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.activeChallenges}</p>
                <p className="text-sm text-muted-foreground">Défis Actifs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-success flex items-center justify-center">
                <Users className="h-6 w-6 text-success-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalParticipants}</p>
                <p className="text-sm text-muted-foreground">Participants</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Challenges */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Défis Récents
          </CardTitle>
        </CardHeader>
        <CardContent>
          {challenges.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Vous n'avez pas encore créé de défi
              </p>
              <Button
                onClick={() => navigate("/dashboard/create-challenge")}
                className="mt-4"
                variant="outline"
              >
                Créer mon premier défi
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {challenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
                  onClick={() => navigate(`/dashboard/challenge/${challenge.id}`)}
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{challenge.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {challenge.subject} • {challenge.participant_count} participants
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        challenge.is_active
                          ? "bg-success/20 text-success"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {challenge.is_active ? "Actif" : "Terminé"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
