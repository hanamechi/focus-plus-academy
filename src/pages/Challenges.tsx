import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Search, BookOpen, Calendar, Users, ArrowRight, Mail, User } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Challenge {
  id: string;
  title: string;
  description: string | null;
  subject: string;
  start_date: string;
  end_date: string;
  creator_id: string;
  participant_count?: number;
  is_joined?: boolean;
  creator_email?: string;
  creator_name?: string;
}

export default function Challenges() {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchChallenges();
  }, [user]);

  const fetchChallenges = async () => {
    setIsLoading(true);

    const { data: challengesData } = await supabase
      .from("challenges")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (challengesData && user) {
      // Get user's participations
      const { data: participations } = await supabase
        .from("challenge_participants")
        .select("challenge_id")
        .eq("user_id", user.id);

      const joinedIds = new Set(participations?.map((p) => p.challenge_id) || []);

      // Get creator profiles for emails
      const creatorIds = [...new Set(challengesData.map(c => c.creator_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, email, first_name, last_name")
        .in("user_id", creatorIds);

      const profilesMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

      // Get participant counts
      const challengesWithData = await Promise.all(
        challengesData.map(async (challenge) => {
          const { count } = await supabase
            .from("challenge_participants")
            .select("*", { count: "exact", head: true })
            .eq("challenge_id", challenge.id);

          const creatorProfile = profilesMap.get(challenge.creator_id);

          return {
            ...challenge,
            participant_count: count || 0,
            is_joined: joinedIds.has(challenge.id),
            creator_email: creatorProfile?.email || "",
            creator_name: creatorProfile ? `${creatorProfile.first_name} ${creatorProfile.last_name}` : "",
          };
        })
      );

      setChallenges(challengesWithData);
    }

    setIsLoading(false);
  };

  const handleJoinChallenge = async (challengeId: string) => {
    if (!user) return;

    const { error } = await supabase.from("challenge_participants").insert({
      challenge_id: challengeId,
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
      fetchChallenges();
    }
  };

  const filteredChallenges = challenges.filter(
    (challenge) =>
      challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      challenge.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Explorer les Défis</h1>
        <p className="text-muted-foreground">
          Découvrez et rejoignez les défis publiés par vos professeurs
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher par titre ou matière..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Challenges Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="glass-card animate-pulse">
              <CardContent className="p-6 h-48" />
            </Card>
          ))}
        </div>
      ) : filteredChallenges.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="p-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun défi trouvé</h3>
            <p className="text-muted-foreground">
              {searchQuery
                ? "Aucun défi ne correspond à votre recherche"
                : "Aucun défi n'est disponible pour le moment"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map((challenge) => (
            <Card
              key={challenge.id}
              className="glass-card hover:shadow-glass-hover transition-shadow cursor-pointer"
              onClick={() => navigate(`/dashboard/challenge/${challenge.id}`)}
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
                  {challenge.is_joined && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-success/20 text-success">
                      Rejoint
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Creator info */}
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-primary" />
                    <span className="font-medium">{challenge.creator_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <Mail className="h-3 w-3" />
                    <span>{challenge.creator_email}</span>
                  </div>
                </div>

                {challenge.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {challenge.description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {format(new Date(challenge.end_date), "d MMM", { locale: fr })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{challenge.participant_count} participants</span>
                  </div>
                </div>

                {role === "student" && !challenge.is_joined && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleJoinChallenge(challenge.id);
                    }}
                    className="w-full gradient-primary text-primary-foreground"
                  >
                    Participer
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
