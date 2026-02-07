import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BookOpen, Calendar, Users, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Challenge {
  id: string;
  title: string;
  subject: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  participant_count?: number;
}

export default function MyChallenges() {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchChallenges();
    }
  }, [user, role]);

  const fetchChallenges = async () => {
    setIsLoading(true);

    if (role === "professor") {
      // Fetch challenges created by this professor
      const { data } = await supabase
        .from("challenges")
        .select("*")
        .eq("creator_id", user!.id)
        .order("created_at", { ascending: false });

      if (data) {
        const challengesWithCounts = await Promise.all(
          data.map(async (challenge) => {
            const { count } = await supabase
              .from("challenge_participants")
              .select("*", { count: "exact", head: true })
              .eq("challenge_id", challenge.id);

            return { ...challenge, participant_count: count || 0 };
          })
        );
        setChallenges(challengesWithCounts);
      }
    } else {
      // Fetch challenges joined by this student
      const { data: participations } = await supabase
        .from("challenge_participants")
        .select("challenge_id")
        .eq("user_id", user!.id);

      if (participations && participations.length > 0) {
        const challengeIds = participations.map((p) => p.challenge_id);
        const { data: challengesData } = await supabase
          .from("challenges")
          .select("*")
          .in("id", challengeIds)
          .order("created_at", { ascending: false });

        if (challengesData) {
          const challengesWithCounts = await Promise.all(
            challengesData.map(async (challenge) => {
              const { count } = await supabase
                .from("challenge_participants")
                .select("*", { count: "exact", head: true })
                .eq("challenge_id", challenge.id);

              return { ...challenge, participant_count: count || 0 };
            })
          );
          setChallenges(challengesWithCounts);
        }
      } else {
        setChallenges([]);
      }
    }

    setIsLoading(false);
  };

  const handleDeleteChallenge = async (challengeId: string) => {
    const { error } = await supabase
      .from("challenges")
      .delete()
      .eq("id", challengeId);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le défi",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Défi supprimé",
        description: "Le défi a été supprimé avec succès",
      });
      fetchChallenges();
    }
  };

  const handleLeaveChallenge = async (challengeId: string) => {
    const { error } = await supabase
      .from("challenge_participants")
      .delete()
      .eq("challenge_id", challengeId)
      .eq("user_id", user!.id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de quitter le défi",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Défi quitté",
        description: "Vous avez quitté le défi",
      });
      fetchChallenges();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Mes Défis</h1>
          <p className="text-muted-foreground">
            {role === "professor"
              ? "Gérez les défis que vous avez créés"
              : "Les défis que vous avez rejoints"}
          </p>
        </div>
        {role === "professor" && (
          <Button
            onClick={() => navigate("/dashboard/create-challenge")}
            className="gradient-primary text-primary-foreground"
          >
            <Plus className="mr-2 h-4 w-4" />
            Créer un Défi
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="glass-card animate-pulse">
              <CardContent className="p-6 h-48" />
            </Card>
          ))}
        </div>
      ) : challenges.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="p-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {role === "professor"
                ? "Vous n'avez pas encore créé de défi"
                : "Vous n'avez rejoint aucun défi"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {role === "professor"
                ? "Créez votre premier défi pour le partager avec vos étudiants"
                : "Explorez les défis disponibles et rejoignez-en un"}
            </p>
            <Button
              onClick={() =>
                navigate(
                  role === "professor"
                    ? "/dashboard/create-challenge"
                    : "/dashboard/challenges"
                )
              }
              variant="outline"
            >
              {role === "professor" ? "Créer un défi" : "Explorer les défis"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => (
            <Card
              key={challenge.id}
              className="glass-card hover:shadow-glass-hover transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">
                      {challenge.title}
                    </CardTitle>
                    <p className="text-sm text-primary font-medium mt-1">
                      {challenge.subject}
                    </p>
                  </div>
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
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {format(new Date(challenge.start_date), "d MMM", { locale: fr })} -{" "}
                      {format(new Date(challenge.end_date), "d MMM", { locale: fr })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{challenge.participant_count}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate(`/dashboard/challenge/${challenge.id}`)}
                  >
                    Voir détails
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="icon" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="glass">
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {role === "professor" ? "Supprimer ce défi ?" : "Quitter ce défi ?"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {role === "professor"
                            ? "Cette action est irréversible. Tous les participants seront retirés."
                            : "Vous pourrez toujours rejoindre ce défi plus tard."}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            role === "professor"
                              ? handleDeleteChallenge(challenge.id)
                              : handleLeaveChallenge(challenge.id)
                          }
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {role === "professor" ? "Supprimer" : "Quitter"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
