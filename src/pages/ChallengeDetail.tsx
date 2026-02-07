import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Calendar,
  Users,
  FileText,
  Download,
  BookOpen,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Challenge {
  id: string;
  title: string;
  description: string | null;
  subject: string;
  start_date: string;
  end_date: string;
  file_url: string | null;
  file_name: string | null;
  is_active: boolean;
  creator_id: string;
}

export default function ChallengeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const { toast } = useToast();

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [participantCount, setParticipantCount] = useState(0);
  const [isJoined, setIsJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchChallenge();
    }
  }, [id, user]);

  const fetchChallenge = async () => {
    setIsLoading(true);

    const { data } = await supabase
      .from("challenges")
      .select("*")
      .eq("id", id)
      .single();

    if (data) {
      setChallenge(data);

      // Get participant count
      const { count } = await supabase
        .from("challenge_participants")
        .select("*", { count: "exact", head: true })
        .eq("challenge_id", id);

      setParticipantCount(count || 0);

      // Check if user has joined
      if (user) {
        const { data: participation } = await supabase
          .from("challenge_participants")
          .select("*")
          .eq("challenge_id", id)
          .eq("user_id", user.id)
          .single();

        setIsJoined(!!participation);
      }
    }

    setIsLoading(false);
  };

  const handleJoin = async () => {
    if (!user || !challenge) return;

    const { error } = await supabase.from("challenge_participants").insert({
      challenge_id: challenge.id,
      user_id: user.id,
    });

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de rejoindre le défi",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Succès! 🎉",
        description: "Vous avez rejoint le défi",
      });
      setIsJoined(true);
      setParticipantCount((prev) => prev + 1);
    }
  };

  const handleLeave = async () => {
    if (!user || !challenge) return;

    const { error } = await supabase
      .from("challenge_participants")
      .delete()
      .eq("challenge_id", challenge.id)
      .eq("user_id", user.id);

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
      setIsJoined(false);
      setParticipantCount((prev) => prev - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card className="glass-card animate-pulse">
          <CardContent className="p-8 h-96" />
        </Card>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Défi introuvable</h2>
        <p className="text-muted-foreground mb-4">
          Ce défi n'existe pas ou a été supprimé
        </p>
        <Button onClick={() => navigate(-1)} variant="outline">
          Retour
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <Button variant="ghost" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>

      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">{challenge.title}</CardTitle>
              <p className="text-primary font-medium mt-1">{challenge.subject}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                challenge.is_active
                  ? "bg-success/20 text-success"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {challenge.is_active ? "Actif" : "Terminé"}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>
                {format(new Date(challenge.start_date), "d MMMM yyyy", { locale: fr })} -{" "}
                {format(new Date(challenge.end_date), "d MMMM yyyy", { locale: fr })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>{participantCount} participants</span>
            </div>
          </div>

          {/* Description */}
          {challenge.description && (
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {challenge.description}
              </p>
            </div>
          )}

          {/* File download */}
          {challenge.file_url && (
            <div className="p-4 rounded-xl bg-secondary/50">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Fichier joint
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {challenge.file_name || "Document"}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(challenge.file_url!, "_blank")}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger
                </Button>
              </div>
            </div>
          )}

          {/* Action buttons */}
          {role === "student" && (
            <div className="pt-4">
              {isJoined ? (
                <div className="flex items-center gap-4">
                  <div className="flex-1 p-4 rounded-xl bg-success/10 text-success">
                    <p className="font-medium">Vous participez à ce défi</p>
                  </div>
                  <Button variant="outline" onClick={handleLeave}>
                    Quitter
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleJoin}
                  className="w-full gradient-primary text-primary-foreground"
                  disabled={!challenge.is_active}
                >
                  Participer à ce défi
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
